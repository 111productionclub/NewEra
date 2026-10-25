import type { Product } from "@/types/product";
import { products as localProducts } from "./products";

// На сервере rebuild-site.sh передаёт адрес Django. Без него (локально, pnpm dev) берём заглушку из products.ts
const API_URL = process.env.PRODUCTS_API_URL;

export async function getProducts(): Promise<Product[]> {
    if (!API_URL) return localProducts;
    const res = await fetch(`${API_URL}/api/products/`);
    if (!res.ok) throw new Error(`Products API: ${res.status}`);
    const data = await res.json();
    const list: Product[] = Array.isArray(data) ? data : data.results;
    return list.map((p) => ({
        ...p,
        images: p.images.map((u) => (u.startsWith("http") ? new URL(u).pathname : u)),
    }));
}
