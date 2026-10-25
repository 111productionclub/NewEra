import { ProductCatalog } from "@/components/product/ProductCatalog";
import { getProducts } from "@/data/getProducts"

export default async function Home() {
  const products = await getProducts();
  return (
    <main>
      <ProductCatalog products={products} />
    </main>
  );
}
