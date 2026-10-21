"use client";

import { useState } from "react";
import type { Product, ProductCategory } from "@/types/product";
import { CATEGORY_LABELS } from "@/data/categories";
import { ProductGrid } from "./ProductGrid";

type ProductCatalogProps = {
    products: Product[];
};

export function ProductCatalog({ products }: ProductCatalogProps) {
    const [active, setActive] = useState<ProductCategory | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const categories = Object.keys(CATEGORY_LABELS) as ProductCategory[];
    const visible = active ? products.filter((p) => p.category === active) : products;

    const pillClass = (isActive: boolean) =>
        `h-8 sm:h-[42px] px-3 sm:px-5 rounded-[11px] border border-black text-sm sm:text-xl text-stroke transition duration-200 hover:-translate-y-0.5 ${isActive ? "bg-black text-white" : "bg-white hover:bg-[#f1f1f1]"}`;

    return (
        <>
            <h1 className="mt-[26px] ml-[13px] sm:ml-[41px]">
                <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setIsOpen(!isOpen)}
                    className="inline-flex items-center gap-1.5 text-[13px] leading-[18px] sm:text-xl sm:leading-7 text-stroke transition-opacity hover:opacity-75"
                >
                    Каталог{active && ` · ${CATEGORY_LABELS[active]}`}
                    <svg className={`h-3 w-[9px] sm:h-4 sm:w-3 transition-transform duration-300 ${isOpen ? "" : "-rotate-90"}`} viewBox="0 0 12 16" fill="none" aria-hidden="true">
                        <path d="M6 0v15M1 10l5 5 5-5" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                </button>
            </h1>
            <div className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden" inert={!isOpen}>
                    <div className="flex flex-wrap gap-2 sm:gap-3 px-2 pt-3 pb-1 sm:px-[41px]">
                        <button type="button" aria-pressed={active === null} onClick={() => setActive(null)} className={pillClass(active === null)}>
                            Все
                        </button>
                        {categories.map((category) => (
                            <button key={category} type="button" aria-pressed={active === category} onClick={() => setActive(category)} className={pillClass(active === category)}>
                                {CATEGORY_LABELS[category]}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            {visible.length > 0 ? (
                <ProductGrid products={visible} />
            ) : (
                <p className="px-[13px] py-10 text-center text-sm sm:text-xl">Скоро здесь появятся новые вещи</p>
            )}
        </>
    );
}
