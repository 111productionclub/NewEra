import { products } from "@/data/products"
import { notFound } from "next/navigation"
import { ProductGallery } from "@/components/product/ProductGallery"

type ProductPageProps = {
    params: Promise<{ slug: string }>;
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
                    <h1 className="text-3xl mt-2">{product.price} ₽</h1>
                    <div className="flex gap-2 mt-6" >
                        {product.sizes.map((size) => (
                            <button className="border border-red-bright px-4 py-2" key={size}>{size}</button>
                        ))}
                    </div>
                    {product.description.map((line) => (
                        <p className="text-sm mt-2" key={line}>{line}</p>
                    ))}
                    <div className="mt-6">
                        {product.status === "sold-out" ? (
                            <span className="text-grey">Нет в наличии</span>
                        ) : (
                            <a className="inline-block border border-red-bright text-red-text px-6 py-3 hover:bg-red-bright hover:text-white" href={product.vkUrl} target="_blank" rel="noopener noreferrer">Купить в VK</a>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}

export function generateStaticParams() {
    return products.map((p) => ({ slug: p.slug }));
}
