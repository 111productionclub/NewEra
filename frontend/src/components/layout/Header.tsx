import Image from "next/image"
import Link from "next/link"

export function Header() {
    return (
        <header className="flex items-center justify-between h-14 md:h-[93px] px-4 md:px-[41px] bg-[linear-gradient(rgba(0,0,0,0.34),rgba(0,0,0,0.34)),url('/img/header-bg.jpg')]
 bg-cover bg-center sticky top-0 z-20 shrink-0 shadow-[inset_0_4px_4px_rgba(0,0,0,0.25)]">
            
            <button type="button" aria-label="Меню">
                <Image src="/icons/menu.svg" alt="" width={37} height={37}></Image>
            </button>
            <Link href="/" className="w-16 h-auto md:w-[107px] absolute left-1/2 -translate-x-1/2 top-[-6px] md:top-[-13px]">
                <Image src="/img/logo.png" alt="NewEra" width={107} height={107} />
            </Link>
        </header>
    );
}