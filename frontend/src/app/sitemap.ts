import type { MetadataRoute } from "next"
import { products } from "@/data/products"
import { SITE_URL } from "@/config/site"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        { url: SITE_URL },
        { url: `${SITE_URL}/about` },
        ...products.map((p) => ({ url: `${SITE_URL}/products/${p.slug}` })),
    ]
}
