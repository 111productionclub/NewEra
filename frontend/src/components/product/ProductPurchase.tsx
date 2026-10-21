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

  function handleBuy() {
    const text = `Привет! Хочу купить ${product.name}, размер ${selected}`;
    navigator.clipboard.writeText(text);
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
        <button
          className="mt-3.5 sm:mt-[35px] h-[29px] sm:h-[46px] px-[9px] sm:px-[13px] rounded-[11px] border border-black bg-red text-white text-xs sm:text-2xl text-stroke transition hover:brightness-125 disabled:bg-[#777] disabled:cursor-not-allowed disabled:hover:brightness-100"
          type="button"
          disabled={selected === null}
          onClick={handleBuy}
        >
          Купить в VK
        </button>
      )}
    </div>
  );
}
