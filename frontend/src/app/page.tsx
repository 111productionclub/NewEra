import { ProductCatalog } from "@/components/product/ProductCatalog";
import { products } from "@/data/products"

export default function Home() {
  return (
    <main>
      <ProductCatalog products={products} />
    </main>
  );
}
