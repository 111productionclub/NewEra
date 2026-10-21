import io
import shutil
import tempfile

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from django.urls import reverse
from PIL import Image

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
