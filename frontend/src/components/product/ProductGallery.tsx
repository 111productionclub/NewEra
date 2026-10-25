"use client";

import type { Product } from "@/types/product";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type ProductGalleryProps = {
    product: Product;
};

const SWIPE_DISTANCE = 40;

type ArrowButtonProps = {
    direction: "prev" | "next";
    onClick: () => void;
    className: string;
};

function ArrowButton({ direction, onClick, className }: ArrowButtonProps) {
    return (
        <button
            type="button"
            aria-label={direction === "prev" ? "Предыдущее фото" : "Следующее фото"}
            onClick={onClick}
            className={`absolute top-1/2 -translate-y-1/2 transition-transform hover:scale-105 ${className}`}
        >
            <Image className={direction === "prev" ? "-scale-x-100" : ""} src="/icons/arrow-right.svg" alt="" width={69} height={69} />
        </button>
    );
}

export function ProductGallery({ product }: ProductGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const touchStartX = useRef<number | null>(null);
    const viewerRef = useRef<HTMLDialogElement>(null);
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

    // Пока фото открыто на весь экран, страница под ним не прокручивается
    useEffect(() => {
        if (!isViewerOpen) return;
        const root = document.documentElement;
        root.style.overflow = "hidden";
        return () => { root.style.overflow = ""; };
    }, [isViewerOpen]);

    if (count === 0) {
        return <div>Нет доступных изображений</div>;
    }

    function handleTouchEnd(e: React.TouchEvent) {
        if (touchStartX.current === null || count < 2) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(dx) >= SWIPE_DISTANCE) go(dx < 0 ? 1 : -1);
    }

    function openViewer() {
        // showModal: браузер сам кладёт окно поверх всего, держит фокус внутри и закрывает по Esc
        viewerRef.current?.showModal();
        setIsViewerOpen(true);
    }

    function handleViewerClick(e: React.MouseEvent) {
        // Клик по фото или фону закрывает, по стрелкам и миниатюрам нет
        if ((e.target as HTMLElement).closest("button")) return;
        viewerRef.current?.close();
    }

    return (
        <div className="w-full">
            <div
                className="relative aspect-[600/582] w-full overflow-hidden rounded-[11px] bg-grey"
                onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
                onTouchEnd={handleTouchEnd}
            >
                <button type="button" aria-label="Открыть фото на весь экран" onClick={openViewer} className="absolute inset-0 block h-full w-full cursor-zoom-in">
                    <Image key={activeIndex} src={images[activeIndex]} alt={product.name} fill className="object-cover motion-safe:animate-fade-in" sizes="(max-width: 640px) 283px, 457px" priority />
                </button>
                {count > 1 && <ArrowButton direction="prev" onClick={() => go(-1)} className="left-0 h-11 w-11 sm:h-[69px] sm:w-[69px]" />}
                {count > 1 && <ArrowButton direction="next" onClick={() => go(1)} className="right-0 h-11 w-11 sm:h-[69px] sm:w-[69px]" />}
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
            <dialog
                ref={viewerRef}
                aria-label={product.name}
                onClose={() => setIsViewerOpen(false)}
                onClick={handleViewerClick}
                onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
                onTouchEnd={handleTouchEnd}
                className="m-0 h-dvh max-h-none w-screen max-w-none bg-black/95 p-0 backdrop:bg-black/80"
            >
                {/* Картинку рендерим только когда окно открыто: закрытый просмотр ничего не скачивает */}
                {isViewerOpen && (
                    <>
                        {/* sizes="100vw": загрузчик отдаёт самую большую версию (_1600), она остаётся лёгкой (WebP) */}
                        <Image key={activeIndex} src={images[activeIndex]} alt={product.name} fill className="object-contain motion-safe:animate-fade-in" sizes="100vw" />
                        <button
                            type="button"
                            aria-label="Закрыть"
                            onClick={() => viewerRef.current?.close()}
                            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl not-italic leading-none text-black transition-transform hover:scale-105 sm:right-6 sm:top-6"
                        >
                            ×
                        </button>
                        {count > 1 && (
                            <>
                                <ArrowButton direction="prev" onClick={() => go(-1)} className="left-2 h-11 w-11 sm:left-6 sm:h-[69px] sm:w-[69px]" />
                                <ArrowButton direction="next" onClick={() => go(1)} className="right-2 h-11 w-11 sm:right-6 sm:h-[69px] sm:w-[69px]" />
                                <p className="absolute inset-x-0 bottom-4 text-center font-text text-sm not-italic text-white">
                                    {activeIndex + 1} / {count}
                                </p>
                            </>
                        )}
                    </>
                )}
            </dialog>
        </div>
    );
}
