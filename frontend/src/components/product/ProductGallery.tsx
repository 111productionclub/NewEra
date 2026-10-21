"use client";

import type { Product } from "@/types/product";
import Image from "next/image";
import { useState } from "react";

type ProductGalleryProps = {
    product: Product;
};

export function ProductGallery({ product }: ProductGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const images = product.images;

    if (images.length === 0) {
        return <div>Нет доступных изображений</div>;
    }

    return (
        <div className="w-full">
            <div className="relative aspect-[457/582] w-full overflow-hidden rounded-[11px] bg-grey">
                <Image key={activeIndex} src={images[activeIndex]} alt={product.name} fill className="object-cover motion-safe:animate-fade-in" sizes="(max-width: 640px) 283px, 457px" priority />
                {images.length > 1 && (
                    <button
                        type="button"
                        aria-label="Следующее фото"
                        onClick={() => setActiveIndex((activeIndex + 1) % images.length)}
                        className="absolute right-0 top-1/2 h-[39px] w-[39px] -translate-y-1/2 transition-transform hover:scale-105 sm:h-[69px] sm:w-[69px]"
                    >
                        <Image src="/icons/arrow-right.svg" alt="" width={69} height={69} />
                    </button>
                )}
            </div>
            {images.length > 1 && (
                <div className="mt-1.5 flex gap-[5px] sm:mt-[21px] sm:gap-[9px]">
                    {images.map((imgUrl, idx) => (
                        <button
                            key={imgUrl}
                            type="button"
                            onClick={() => setActiveIndex(idx)}
                            aria-label={`Фото ${idx + 1}`}
                            className={`relative overflow-hidden rounded-[11px] bg-grey h-[37px] w-[37px] sm:h-[88px] sm:w-[88px] outline-2 -outline-offset-2 transition-[outline-color] ${idx === activeIndex ? "outline-red-bright" : "outline-transparent"}`}
                        >
                            <Image src={imgUrl} alt="" fill className="object-cover" sizes="88px" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
