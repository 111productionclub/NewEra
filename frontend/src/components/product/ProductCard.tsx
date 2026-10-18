import type { Product } from "@/types/product";
import Image from "next/image" 
import Link from "next/link"


type ProductCardProps = {
    product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
    return (
        <div>
            <Link className="relative block aspect-[363/462] overflow-hidden" href={`/products/${product.slug}`}>
                <Image className="object-cover" src={product.images[0]} alt={product.name} fill sizes="(min-width:1024px) 25vw, (min-width: 640px) 50vw, 100vw"/>
            </Link>
            <p>{product.name}</p>    
            <p>{product.price}₽</p>
        </div>
    );
}