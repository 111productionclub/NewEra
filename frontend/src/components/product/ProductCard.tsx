import type { Product } from "@/types/product";

type ProductCardProps = {
    product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
    return (
        <div>
            <p>{product.name}</p>    
        </div>
    );
}