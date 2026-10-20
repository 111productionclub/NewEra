import { products } from "@/data/products"
import { notFound } from "next/navigation"
import { ProductGallery } from "@/components/product/ProductGallery"
import { ProductPurchase } from "@/components/product/ProductPurchase"

type ProductPageProps = {
    params: Promise<{ slug: string }>;
}


export async function  generateMetadata({ params }: ProductPageProps) {
    const { slug } = await params;
    const product = products.find((p) => p.slug === slug);
    if (!product) return {};
    return { title: `${product.name} | new era`, description: product.description[0] };
}



export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;
    const product = products.find((p) => p.slug === slug);
    if (!product) {
        notFound();
    }
    return (
        <main>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 max-w-5xl mx-auto">
                <div> 
                    <ProductGallery product={product} />
                </div>
                <div>
                    <h1 className="text-4xl">{product.name}</h1>
                    <p className="text-3xl mt-2">{product.price} ₽</p>
                    {product.description.map((line) => (
                        <p className="text-sm mt-2" key={line}>{line}</p>
                    ))}
                    <ProductPurchase product={product} />
                </div>
            </div>
        </main>
    )
}

export function generateStaticParams() {
    return products.map((p) => ({ slug: p.slug }));
}
