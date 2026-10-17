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
            {product.images.map((src) => (
                <Image key={src} src={src} alt={product.name} width={400} height={500}/>
            ))}
            <p>{product.name}</p>
            <p>{product.price} ₽</p>
            {product.sizes.map((size) => (
                <button key={size}>{size}</button>
            ))}
            {product.description.map((line) => (
                <p key={line}>{line}</p>
            ))}
            {product.status === "sold-out" ? (
                <span>Нет в наличии</span>
            ) : (
                <a href={product.vkUrl} target="_blank" rel="noopener noreferrer">Купить в VK</a>
            )}
        </main>
    )
}

