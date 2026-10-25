"""Делает WebP-версии для фото, загруженных до появления сжатия. Новые фото сжимаются сами при загрузке."""

from django.core.management.base import BaseCommand

from products.images import has_variants, make_variants
from products.models import ProductImage


class Command(BaseCommand):
    help = "Создаёт WebP 400/800/1600 для всех фото товаров (уже готовые пропускает)"

    def add_arguments(self, parser):
        parser.add_argument("--force", action="store_true", help="Пересоздать и те, что уже готовы")

    def handle(self, *args, force=False, **options):
        done = skipped = failed = 0
        for photo in ProductImage.objects.select_related("product"):
            label = f"{photo.product.slug}: {photo.image.name}"
            if not force and has_variants(photo.image):
                skipped += 1
                continue
            try:
                make_variants(photo.image)
            except Exception as error:  # битый или удалённый файл не должен останавливать остальные
                failed += 1
                self.stderr.write(self.style.ERROR(f"Ошибка {label}: {error}"))
                continue
            done += 1
            self.stdout.write(f"Готово {label}")
        self.stdout.write(self.style.SUCCESS(f"Сжато: {done}, уже было: {skipped}, ошибок: {failed}"))
