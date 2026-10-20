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
        <span className="text-grey">Нет в наличии</span>
      ) : (
        <button
          className="disabled:opacity-50 disabled:cursor-not-allowed border border-red-bright text-red-text px-6 py-3 hover:bg-red-bright hover:text-white mt-6"
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
