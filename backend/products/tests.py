import io
import os
import shutil
import tempfile

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.management import call_command
from django.test import TestCase, override_settings
from django.urls import reverse
from PIL import Image

from .images import SIZES, has_variants, variant_name
from .models import Product, ProductImage

TMP_MEDIA = tempfile.mkdtemp()


def make_image(name="photo.png"):
    buffer = io.BytesIO()
    Image.new("RGB", (20, 20), "red").save(buffer, "PNG")
    return SimpleUploadedFile(name, buffer.getvalue(), content_type="image/png")


@override_settings(MEDIA_ROOT=TMP_MEDIA)
class ProductApiTests(TestCase):
    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        shutil.rmtree(TMP_MEDIA, ignore_errors=True)

    def setUp(self):
        self.product = Product.objects.create(
            slug="tee", name="Tee", price=3500, category="top", sizes="big, overbig",
            description="строка 1\n\nстрока 2", vk_url="https://vk.com/x",
        )
        ProductImage.objects.create(product=self.product, image=make_image("b.png"), order=1)
        ProductImage.objects.create(product=self.product, image=make_image("a.png"), order=0)

    def test_list_matches_frontend_product_shape(self):
        data = self.client.get("/api/products/").json()
        self.assertEqual(len(data), 1)
        item = data[0]
        self.assertEqual(set(item), {"id", "slug", "name", "price", "category", "status", "images", "sizes", "description", "vkUrl"})
        self.assertEqual(item["id"], "tee")
        self.assertEqual(item["sizes"], ["big", "overbig"])
        self.assertEqual(item["description"], ["строка 1", "строка 2"])
        self.assertEqual(item["vkUrl"], "https://vk.com/x")

    def test_images_are_ordered_and_absolute(self):
        images = self.client.get("/api/products/tee/").json()["images"]
        self.assertEqual(len(images), 2)
        self.assertTrue(all(url.startswith("http://testserver/media/products/") for url in images))
        self.assertIn("a", images[0])

    def test_unpublished_product_is_hidden(self):
        Product.objects.filter(pk=self.product.pk).update(is_published=False)
        self.assertEqual(self.client.get("/api/products/").json(), [])
        self.assertEqual(self.client.get("/api/products/tee/").status_code, 404)

    def test_api_is_read_only(self):
        self.assertEqual(self.client.post("/api/products/", {"name": "x"}).status_code, 405)

    def test_admin_requires_login_and_can_edit_price_and_upload_photo(self):
        self.assertEqual(self.client.get(reverse("admin:products_product_changelist")).status_code, 302)
        admin = get_user_model().objects.create_superuser("boss", "b@example.com", "pass12345!")
        self.client.force_login(admin)
        url = reverse("admin:products_product_change", args=[self.product.pk])
        self.assertEqual(self.client.get(url).status_code, 200)
        existing = list(self.product.images.values_list("pk", flat=True))
        data = {
            "name": "Tee 2", "slug": "tee", "price": "4100", "category": "top", "status": "few-left",
            "is_published": "on", "order": "0", "sizes": "big", "description": "новое", "vk_url": "",
            "images-TOTAL_FORMS": "3", "images-INITIAL_FORMS": "2", "images-MIN_NUM_FORMS": "0", "images-MAX_NUM_FORMS": "1000",
            "images-0-id": existing[0], "images-0-product": self.product.pk, "images-0-order": "0",
            "images-1-id": existing[1], "images-1-product": self.product.pk, "images-1-order": "1",
            "images-2-id": "", "images-2-product": self.product.pk, "images-2-order": "2",
            "images-2-image": make_image("new.png"),
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 302, getattr(response, "context", None) and response.context["adminform"].form.errors)
        self.product.refresh_from_db()
        self.assertEqual((self.product.name, self.product.price, self.product.status), ("Tee 2", 4100, "few-left"))
        self.assertEqual(self.product.images.count(), 3)


def make_photo(size, mode="RGB", fmt="JPEG", name="big.jpg", exif_orientation=None):
    buffer = io.BytesIO()
    image = Image.new(mode, size, (200, 30, 30, 128) if mode == "RGBA" else "red")
    kwargs = {}
    if exif_orientation:
        exif = Image.Exif()
        exif[0x0112] = exif_orientation
        kwargs["exif"] = exif
    image.save(buffer, fmt, **kwargs)
    return SimpleUploadedFile(name, buffer.getvalue())


@override_settings(MEDIA_ROOT=TMP_MEDIA)
class ProductImageVariantsTests(TestCase):
    def setUp(self):
        self.product = Product.objects.create(slug="hoodie", name="Hoodie", price=5000, category="top")

    def open_variant(self, photo, size):
        return Image.open(photo.image.storage.path(variant_name(photo.image.name, size)))

    def test_upload_creates_three_webp_sizes(self):
        photo = ProductImage.objects.create(product=self.product, image=make_photo((4000, 3000)))
        for size in SIZES:
            with self.open_variant(photo, size) as variant:
                self.assertEqual(variant.format, "WEBP")
                self.assertEqual(variant.size, (size, size * 3 // 4))

    def test_small_photo_is_not_upscaled(self):
        photo = ProductImage.objects.create(product=self.product, image=make_photo((500, 300)))
        with self.open_variant(photo, 1600) as variant:
            self.assertEqual(variant.size, (500, 300))

    def test_phone_rotation_from_exif_is_applied(self):
        # Orientation 6: снято боком, картинку надо повернуть на 90°
        photo = ProductImage.objects.create(product=self.product, image=make_photo((2000, 1000), exif_orientation=6))
        with self.open_variant(photo, 1600) as variant:
            self.assertEqual(variant.size, (800, 1600))

    def test_transparent_png_keeps_transparency(self):
        upload = make_photo((900, 900), mode="RGBA", fmt="PNG", name="logo.png")
        photo = ProductImage.objects.create(product=self.product, image=upload)
        with self.open_variant(photo, 800) as variant:
            self.assertEqual(variant.mode, "RGBA")

    def test_changing_order_does_not_recompress(self):
        photo = ProductImage.objects.create(product=self.product, image=make_photo((1000, 1000)))
        path = photo.image.storage.path(variant_name(photo.image.name, 400))
        before = os.path.getmtime(path)
        os.utime(path, (before - 100, before - 100))
        photo.order = 5
        photo.save()
        self.assertEqual(os.path.getmtime(path), before - 100)

    def test_api_returns_largest_webp(self):
        ProductImage.objects.create(product=self.product, image=make_photo((2000, 2000)))
        images = self.client.get("/api/products/hoodie/").json()["images"]
        self.assertTrue(images[0].endswith("_1600.webp"))

    def test_optimize_images_command_processes_old_photos(self):
        photo = ProductImage.objects.create(product=self.product, image=make_photo((1000, 1000)))
        storage = photo.image.storage
        for size in SIZES:
            storage.delete(variant_name(photo.image.name, size))
        self.assertEqual(self.client.get("/api/products/hoodie/").json()["images"][0], f"http://testserver{photo.image.url}")

        call_command("optimize_images", stdout=io.StringIO())
        self.assertTrue(has_variants(photo.image))
