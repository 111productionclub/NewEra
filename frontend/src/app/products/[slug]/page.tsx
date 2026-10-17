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
            <Image src={product.images[0]} alt={product.name} width={400} height={500}/>
            <p>{product.name}</p>
            <p>{product.price}₽</p>
        </main>
    )
}

