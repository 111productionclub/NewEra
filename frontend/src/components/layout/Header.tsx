import Image from "next/image"
import Link from "next/link"
import { SideMenu } from "./SideMenu";
import { ScrollWatcher } from "./ScrollWatcher";

export function Header() {
    return (
        <header className="flex items-center justify-end sm:justify-between h-[91px] sm:h-[93px] [html[data-scrolled]_&]:h-16 sm:[html[data-scrolled]_&]:h-[72px] transition-[height] duration-300 pr-[11px] sm:px-[41px] bg-[linear-gradient(rgba(0,0,0,0.34),rgba(0,0,0,0.34)),url('/img/header-bg.jpg')]
 bg-cover bg-center sticky top-0 z-20 shrink-0 shadow-[inset_0_4px_4px_rgba(0,0,0,0.25)]">
            
            <ScrollWatcher />
            <SideMenu />
            <Link href="/" className="absolute left-[-7px] top-[-18px] w-[113px] sm:left-1/2 sm:-translate-x-1/2 sm:top-[-13px] sm:w-[107px] [html[data-scrolled]_&]:top-[-12px] [html[data-scrolled]_&]:w-[84px] sm:[html[data-scrolled]_&]:top-[-10px] sm:[html[data-scrolled]_&]:w-[80px] transition-[width,top] duration-300">
                <Image src="/img/logo.png" alt="NewEra" width={107} height={107} />
            </Link>
        </header>
    );
}