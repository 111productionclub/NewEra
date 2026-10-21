"use client";

import type { Product } from "@/types/product";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type ProductGalleryProps = {
    product: Product;
};

const SWIPE_DISTANCE = 40;

export function ProductGallery({ product }: ProductGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const touchStartX = useRef<number | null>(null);
    const images = product.images;
    const count = images.length;

    const go = useCallback((step: number) => {
        setActiveIndex((current) => (current + step + count) % count);
    }, [count]);

    useEffect(() => {
        if (count < 2) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.altKey || e.ctrlKey || e.metaKey) return;
            if (e.key === "ArrowRight") go(1);
            if (e.key === "ArrowLeft") go(-1);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [count, go]);

    if (count === 0) {
        return <div>Нет доступных изображений</div>;
    }

    function handleTouchEnd(e: React.TouchEvent) {
        if (touchStartX.current === null || count < 2) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(dx) >= SWIPE_DISTANCE) go(dx < 0 ? 1 : -1);
    }

    return (
        <div className="w-full">
            <div
                className="relative aspect-[457/582] w-full overflow-hidden rounded-[11px] bg-grey"
                onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
                onTouchEnd={handleTouchEnd}
            >
                <Image key={activeIndex} src={images[activeIndex]} alt={product.name} fill className="object-cover motion-safe:animate-fade-in" sizes="(max-width: 640px) 283px, 457px" priority />
                {count > 1 && (
                    <button
                        type="button"
                        aria-label="Предыдущее фото"
                        onClick={() => go(-1)}
                        className="absolute left-0 top-1/2 h-11 w-11 -translate-y-1/2 transition-transform hover:scale-105 sm:h-[69px] sm:w-[69px]"
                    >
                        <Image className="-scale-x-100" src="/icons/arrow-right.svg" alt="" width={69} height={69} />
                    </button>
                )}
                {count > 1 && (
                    <button
                        type="button"
                        aria-label="Следующее фото"
                        onClick={() => go(1)}
                        className="absolute right-0 top-1/2 h-11 w-11 -translate-y-1/2 transition-transform hover:scale-105 sm:h-[69px] sm:w-[69px]"
                    >
                        <Image src="/icons/arrow-right.svg" alt="" width={69} height={69} />
                    </button>
                )}
            </div>
            {count > 1 && (
                <div className="mt-1.5 flex gap-[5px] sm:mt-[21px] sm:gap-[9px]">
                    {images.map((imgUrl, idx) => (
                        <button
                            key={imgUrl}
                            type="button"
                            onClick={() => setActiveIndex(idx)}
                            aria-label={`Фото ${idx + 1}`}
                            className={`relative overflow-hidden rounded-[11px] bg-grey h-11 w-11 sm:h-[88px] sm:w-[88px] outline-2 -outline-offset-2 transition-[outline-color] ${idx === activeIndex ? "outline-red-bright" : "outline-transparent"}`}
                        >
                            <Image src={imgUrl} alt="" fill className="object-cover" sizes="88px" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
