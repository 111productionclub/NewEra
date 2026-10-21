import { products } from "@/data/products"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ProductGallery } from "@/components/product/ProductGallery"
import { ProductPurchase } from "@/components/product/ProductPurchase"
import { ProductGrid } from "@/components/product/ProductGrid"

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
    const related = products.filter((p) => p.id !== product.id);
    return (
        <main>
            <section className="flex flex-col items-start px-4 pt-3 min-[1100px]:flex-row min-[1100px]:pt-[39px] min-[1100px]:pl-[6vw] min-[1100px]:pr-10 min-[1700px]:pl-[162px] pb-5">
                <Link href="/" className="flex flex-none flex-col items-center w-[57px] h-[51px] pt-1 text-[8px] leading-3 sm:w-[102px] sm:h-[86px] sm:pt-[7px] rounded-[11px] sm:text-base sm:leading-[22px] border border-red-bright text-red-text transition-colors hover:bg-[#fff3f3]">
                    <Image className="w-[37px] sm:w-[65px] h-auto" src="/icons/back-button.png" alt="" width={130} height={110} />
                    <span className="sm:-mt-[5px]">Назад</span>
                </Link>
                <div className="mx-auto mt-5 w-full max-w-[283px] sm:max-w-[457px] min-[1100px]:mx-0 min-[1100px]:mt-0 min-[1100px]:ml-[6vw] min-[1100px]:flex-none min-[1700px]:ml-[168px]">
                    <ProductGallery product={product} />
                </div>
                <div className="mx-auto mt-5 w-full max-w-[313px] pl-3.5 sm:max-w-[457px] sm:pl-0 min-[1100px]:mx-0 min-[1100px]:mt-0 min-[1100px]:max-w-none min-[1100px]:ml-[4vw] min-[1100px]:min-w-0 min-[1100px]:flex-1 min-[1700px]:ml-[65px]">
                    <h1 className="text-sm leading-[19px] sm:text-[40px] sm:leading-[55px] text-stroke">{product.name}</h1>
                    <p className="mt-3 text-[15px] leading-[21px] sm:mt-2.5 sm:text-4xl sm:leading-[50px] text-stroke">{product.price} ₽</p>
                    <ProductPurchase product={product} />
                    <div className="mt-[15px] sm:mt-[30px] max-w-[804px] text-[11px] leading-[17px] sm:text-xl sm:leading-7">
                        {product.description.map((line) => (
                            <p key={line}>{line}</p>
                        ))}
                    </div>
                </div>
            </section>
            <h2 className="mt-5 ml-3 text-[11px] leading-[15px] sm:mt-[37px] sm:ml-[6vw] sm:text-base sm:leading-[22px] min-[1700px]:ml-[148px]">Смотрите также</h2>
            <ProductGrid products={related} />
        </main>
    )
}

export function generateStaticParams() {
    return products.map((p) => ({ slug: p.slug }));
}
