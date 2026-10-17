import Image from "next/image"
import Link from "next/link"

export function Header() {
    return (
        <header className="flex items-center justify-between h-[93px] px-[41px] bg-[linear-gradient(rgba(0,0,0,0.34),rgba(0,0,0,0.34)),url('/img/header-bg.jpg')]
 bg-cover bg-center sticky top-0 z-20 shrink-0">
            
            <button type="button" aria-label="Меню">
                <Image src="/icons/menu.svg" alt="" width={37} height={37}></Image>
            </button>
            <Link href="/" className="absolute left-1/2 -translate-x-1/2 top-[-13px]">
                <Image src="/img/logo.png" alt="NewEra" width={107} height={107} />
            </Link>
            <button type="button" aria-label="Корзина">
                <Image src="/icons/cart.svg" alt="" width={37} height={37}></Image>
            </button>
        </header>
    );
}