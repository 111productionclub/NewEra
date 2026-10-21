import { ProductCard } from "@/components/product/ProductCard";
import { products } from "@/data/products"

export default function Home() {
  return (
    <main>
      <div className="grid grid-cols-[repeat(2,minmax(0,363px))] min-[1100px]:grid-cols-[repeat(4,minmax(0,363px))] justify-center gap-3 sm:gap-[3.5vw] min-[1700px]:gap-[68px] px-2 sm:px-[41px] pt-5 pb-10 sm:pb-[60px]">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
