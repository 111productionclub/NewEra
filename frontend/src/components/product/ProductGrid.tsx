import type { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

type ProductGridProps = {
    products: Product[];
};

export function ProductGrid({ products }: ProductGridProps) {
    return (
        <div className="grid grid-cols-[repeat(2,minmax(0,363px))] lg:grid-cols-[repeat(4,minmax(0,363px))] justify-center gap-3 sm:gap-[3.5vw] 2xl:gap-[68px] px-2 sm:px-[41px] pt-5 pb-10 sm:pb-[60px]">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
