import Image from "next/image"
import Link from "next/link"
import { SideMenu } from "./SideMenu";

export function Header() {
    return (
        <header className="flex items-center justify-end sm:justify-between h-[91px] sm:h-[93px] pr-[11px] sm:px-[41px] bg-[linear-gradient(rgba(0,0,0,0.34),rgba(0,0,0,0.34)),url('/img/header-bg.jpg')]
 bg-cover bg-center sticky top-0 z-20 shrink-0 shadow-[inset_0_4px_4px_rgba(0,0,0,0.25)]">
            
            <SideMenu />
            <Link href="/" className="absolute left-[-7px] top-[-18px] w-[113px] sm:left-1/2 sm:-translate-x-1/2 sm:top-[-13px] sm:w-[107px]">
                <Image src="/img/logo.png" alt="NewEra" width={107} height={107} />
            </Link>
        </header>
    );
}