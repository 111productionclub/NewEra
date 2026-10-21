import type { Product } from "@/types/product";
import Image from "next/image"
import Link from "next/link"

type ProductCardProps = {
    product: Product;
};

const STATUS_LABELS: Record<Product["status"], string> = {
    "in-stock": "In stock",
    "sold-out": "Sold Out",
    "few-left": "Few left",
};

export function ProductCard({ product }: ProductCardProps) {
    return (
        <Link className="@container relative block aspect-[363/462] overflow-hidden rounded-[11px] not-italic text-white transition-transform duration-200 hover:-translate-y-1" href={`/products/${product.slug}`}>
            <Image className="object-cover" src={product.images[0]} alt={product.name} fill sizes="(min-width:1100px) 25vw, 50vw"/>
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/60 to-transparent" />
            <p className="absolute top-[4.5%] right-[6%] w-min text-center leading-tight text-stroke text-[clamp(11px,6.6cqw,24px)]">
                {STATUS_LABELS[product.status]}
            </p>
            <div className="absolute inset-x-0 bottom-[3%] text-center text-stroke text-[clamp(11px,6.6cqw,24px)] leading-snug">
                <p className="whitespace-nowrap">{product.name}</p>
                <p className="whitespace-nowrap mt-[0.55em]">{product.price}₽</p>
            </div>
        </Link>
    );
}
