import type { MetadataRoute } from "next"
import { getProducts } from "@/data/getProducts"
import { SITE_URL } from "@/config/site"

export const dynamic = "force-static"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const products = await getProducts();
    return [
        { url: SITE_URL },
        { url: `${SITE_URL}/about` },
        ...products.map((p) => ({ url: `${SITE_URL}/products/${p.slug}` })),
    ]
}
