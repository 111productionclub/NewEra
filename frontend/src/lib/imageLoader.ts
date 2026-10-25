"use client";

import type { ImageLoaderProps } from "next/image";

// Размеры совпадают с SIZES в backend/products/images.py: бэкенд кладёт рядом <имя>_400/_800/_1600.webp
const VARIANTS = [400, 800, 1600];
const LARGEST = /_1600\.webp$/;

// next/image спрашивает URL под каждую ширину из srcset, браузер сам скачивает подходящий под экран
export default function imageLoader({ src, width }: ImageLoaderProps): string {
    if (!LARGEST.test(src)) {
        // Свои картинки из public/ отдаём как есть, ?w= нужен только чтобы next/image не ругался
        return `${src}?w=${width}`;
    }
    const size = VARIANTS.find((v) => v >= width) ?? VARIANTS[VARIANTS.length - 1];
    return src.replace(LARGEST, `_${size}.webp`);
}
