"""Заливает в базу четыре стартовых товара из frontend/src/data/products.ts вместе с фото из frontend/public/img."""

from pathlib import Path

from django.conf import settings
from django.core.files import File
from django.core.management.base import BaseCommand

from products.models import Product, ProductImage

IMG_DIR = Path(settings.BASE_DIR).parent / "frontend" / "public" / "img"

SEED = [
    {
        "slug": "biohazard", "name": '"BIOHAZARD" t-shirt', "price": 3500, "category": "top", "status": "in-stock",
        "images": ["biohazard-main.jpg", "biohazard-mini-1.jpg", "biohazard-mini-2.jpg"],
        "sizes": "big, overbig",
        "description": "модель: оверсайз крой, декоративные наружные швы, накидка на спине\n"
                       "акцентные элементы: вышивка, прочная DTF печать\n"
                       "материал: футер трехнитка (100% хлопок)",
        "vk_url": "https://vk.ru/market/product/quotbiohazardquot-t-shirt-228893168-13144737",
    },
    {"slug": "bomber", "name": "«kill racing» bomber", "price": 7700, "category": "top", "status": "sold-out",
     "images": ["bomber.jpg"], "sizes": "", "description": "", "vk_url": "https://vk.com/"},
    {"slug": "pants", "name": "pants «shadow»", "price": 2800, "category": "bottom", "status": "few-left",
     "images": ["pants.png"], "sizes": "baby, big, overbig", "description": "", "vk_url": "https://vk.com/"},
    {"slug": "shorts", "name": "shorts «glow»", "price": 3000, "category": "bottom", "status": "in-stock",
     "images": ["shorts.jpg"], "sizes": "baby, big, overbig", "description": "", "vk_url": "https://vk.com/"},
]


class Command(BaseCommand):
    help = "Создаёт стартовые товары, если их ещё нет (существующие не трогает)"

    def handle(self, *args, **options):
        for order, item in enumerate(SEED):
            images = item.pop("images")
            product, created = Product.objects.get_or_create(slug=item["slug"], defaults={**item, "order": order})
            if not created:
                self.stdout.write(f"Пропущено (уже есть): {product.slug}")
                continue
            for position, filename in enumerate(images):
                path = IMG_DIR / filename
                with path.open("rb") as fh:
                    ProductImage.objects.create(product=product, order=position, image=File(fh, name=filename))
            self.stdout.write(self.style.SUCCESS(f"Создано: {product.slug}"))
