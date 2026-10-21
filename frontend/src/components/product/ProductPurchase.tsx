"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import { SizeSelector } from "./SizeSelector";
import { VK_DIALOG_URL } from "@/config/site";

type ProductPurchaseProps = {
  product: Product;
};

export function ProductPurchase({ product }: ProductPurchaseProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function handleBuy() {
    const text = `Привет! Хочу купить ${product.name}, размер ${selected}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    window.open(VK_DIALOG_URL, "_blank", "noopener,noreferrer");
  }

  return (
    <div>
      <SizeSelector
        sizes={product.sizes}
        selected={selected}
        onSelect={setSelected}
      />
      {product.status === "sold-out" ? (
        <span className="mt-3 sm:mt-[35px] block text-sm sm:text-2xl">Нет в наличии</span>
      ) : (
        <div className="mt-3.5 sm:mt-[35px] flex flex-wrap items-center gap-3 sm:gap-5">
        <button
          className="h-9 sm:h-[46px] px-3 sm:px-[13px] rounded-[11px] border border-black bg-red text-white text-sm sm:text-2xl text-stroke transition active:scale-95 hover:brightness-125 disabled:bg-[#777] disabled:cursor-not-allowed disabled:hover:brightness-100"
          type="button"
          disabled={selected === null}
          onClick={handleBuy}
        >
          {copied ? "Текст скопирован ✓" : "Купить в VK"}
        </button>
        {selected === null && (
          <span className="text-sm sm:text-lg text-red-text motion-safe:animate-fade-in">← выберите размер</span>
        )}
        </div>
      )}
    </div>
  );
}
