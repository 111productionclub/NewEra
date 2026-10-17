import Image from "next/image"
import Link from "next/link"

export function Header() {
    return (
        <header className="flex items-center justify-between h-[93px] px-[41px] bg-red">
            <button type="button">Меню</button>
            <Link href="/">
                <Image src="/img/logo.png" alt="NewEra" width={107} height={107} />
            </Link>
            <button type="button">Корзина</button>
        </header>
    );
}