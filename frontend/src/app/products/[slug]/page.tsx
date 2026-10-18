import { products } from "@/data/products"
import Image from "next/image"
import { notFound } from "next/navigation"


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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4">
                <div> 
                    <div className="relative aspect-[4/5]">
                        <Image src={product.images[0]} alt={product.name} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover"/>
                    </div>
                    <div className="flex gap-2 mt-2">
                        {product.images.slice(1).map((src) => (
                            <Image key={src} src={src} alt={product.name} width={88} height={88} />
                        ))}
                    </div>

                </div>
                <div>
                    <p>{product.name}</p>
                    <p>{product.price} ₽</p>
                    <div className="border px-4 py-2">
                        {product.sizes.map((size) => (
                            <button key={size}>{size}</button>
                        ))}
                    </div>
                    {product.description.map((line) => (
                        <p key={line}>{line}</p>
                    ))}
                    <div className="inline-block border px-6 py-3">
                        {product.status === "sold-out" ? (
                            <span>Нет в наличии</span>
                        ) : (
                            <a href={product.vkUrl} target="_blank" rel="noopener noreferrer">Купить в VK</a>
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
