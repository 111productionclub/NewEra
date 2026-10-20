"use client";

import type { Product } from "@/types/product";
import Image from "next/image";
import { useState } from "react";

type ProductGalleryProps = {
    product: Product;
};

export function ProductGallery({ product }: ProductGalleryProps) {
    const [activeSubIndex, setActiveSubIndex] = useState(0);
    const images = product.images || [];

    if (images.length === 0) {
        return <div className="text-gray-500">Нет доступных изображений</div>;
    }

    return (
        <div className="flex flex-col gap-4 w-full max-w-md">
            <div className="relative aspect-[457/582] w-full overflow-hidden">
                <Image src={images[activeSubIndex]} alt={product.name || "Изображение товара"} fill className="object-cover object-center" sizes="(max-width: 768px) 100vw, 450px" priority />
            </div>
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                    {images.map((imgUrl, idx) => (
                    <button key={`${imgUrl}-${idx}`} onClick={() => setActiveSubIndex(idx)} className={`relative aspect-square overflow-hidden rounded-md bg-gray-100 border-2 transition-all ${ idx === activeSubIndex ? "border-red-bright scale-95" : "border-transparent opacity-70 hover:opacity-100" }`}>
                        <Image src={imgUrl} alt={`${product.name || "Товар"} - миниатюра ${idx + 1}`} fill className="object-cover object-center" sizes="100px"/>
                    </button>
                    ))}
                </div>
            )}
        </div>
    );
}
