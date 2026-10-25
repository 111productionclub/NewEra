"""Сжатие фото товаров: из любого загруженного файла делаем три WebP разного размера.

Оригинал остаётся в media/ как есть, рядом появляются products/<имя>_400.webp, _800.webp и _1600.webp.
Фронтенд выбирает нужный размер по имени файла (frontend/src/lib/imageLoader.ts), поэтому имена менять
только вместе с ним.
"""

from io import BytesIO
from pathlib import PurePosixPath

from django.core.files.base import ContentFile
from PIL import Image, ImageOps

# Длинная сторона в пикселях, пропорции сохраняются, фото не обрезается.
# 400: миниатюры в галерее, 800: карточки каталога, 1600: большое фото на странице товара.
SIZES = (400, 800, 1600)
LARGEST = SIZES[-1]

# 82 даёт картинку без заметных артефактов на ткани и принтах, а файл в 5–20 раз легче фото с телефона
QUALITY = 82


def variant_name(name, size):
    path = PurePosixPath(name)
    return str(path.with_name(f"{path.stem}_{size}.webp"))


def has_variants(field_file):
    return all(field_file.storage.exists(variant_name(field_file.name, size)) for size in SIZES)


def _prepare(source):
    # Цветовой профиль переносим только для RGB: профиль CMYK или ч/б к сконвертированному фото не подходит
    icc_profile = source.info.get("icc_profile") if source.mode in ("RGB", "RGBA") else None
    # Телефоны пишут поворот в EXIF, а не в пиксели. Без этого фото ляжет боком
    image = ImageOps.exif_transpose(source)
    transparent = image.mode in ("RGBA", "LA", "PA") or (image.mode == "P" and "transparency" in image.info)
    if transparent:
        image = image.convert("RGBA")
        # PNG часто сохраняют с альфа-каналом, в котором нет прозрачных пикселей: без него файл легче
        if image.getchannel("A").getextrema() == (255, 255):
            image = image.convert("RGB")
    else:
        image = image.convert("RGB")
    return image, icc_profile


def make_variants(field_file):
    with field_file.open("rb"), Image.open(field_file) as source:
        image, icc_profile = _prepare(source)

    storage = field_file.storage
    for size in SIZES:
        resized = image.copy()
        # thumbnail только уменьшает: маленькое фото не растянется и не размоется
        resized.thumbnail((size, size), Image.Resampling.LANCZOS)
        buffer = BytesIO()
        resized.save(buffer, "WEBP", quality=QUALITY, method=6, icc_profile=icc_profile)
        name = variant_name(field_file.name, size)
        if storage.exists(name):
            storage.delete(name)
        storage.save(name, ContentFile(buffer.getvalue()))
