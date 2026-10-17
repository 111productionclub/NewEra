import type { Product } from "@/types/product";
import Image from "next/image" 
import Link from "next/link"


type ProductCardProps = {
    product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
    return (
        <Link href={`/products/${product.slug}`}>
            <p>{product.name}</p>    
            <p>{product.price}₽</p>
            <Image src={product.images[0]} alt={product.name} width={400} height={400}/>
        </Link>
    );
}