import { ProductGrid } from "@/components/product/ProductGrid";
import { products } from "@/data/products"

export default function Home() {
  return (
    <main>
      <ProductGrid products={products} />
    </main>
  );
}
