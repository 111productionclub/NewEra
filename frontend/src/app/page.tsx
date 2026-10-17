import { ProductCard } from "@/components/product/ProductCard";
import { products } from "@/data/products"

export default function Home() {
  return (
    <main>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </main>
  );
}
