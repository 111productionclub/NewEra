"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { VK_URL, TELEGRAM_URL } from "@/config/site"

export function SideMenu(){
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false)
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [])

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : ""
        return () => { document.body.style.overflow = "" }
    }, [isOpen])

    const links = [
        { href: "/", label: "Каталог", active: pathname === "/" || pathname.startsWith("/products") },
        { href: "/about", label: "О бренде", active: pathname.startsWith("/about") },
    ]

    return(
        <>
            <button className="flex h-12 w-12 items-center justify-center transition-opacity hover:opacity-75" type="button" aria-label="Меню" aria-expanded={isOpen} onClick={() => setIsOpen(true)}>
                <Image className="h-[45px] w-[45px] sm:h-[37px] sm:w-[37px]" src="/icons/menu.svg" alt="" width={37} height={37} />
            </button>
            <div className={`fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={() => setIsOpen(false)} />
            <nav
                inert={!isOpen}
                className={`fixed top-0 right-0 sm:right-auto sm:left-0 z-40 flex h-full w-72 flex-col bg-black p-6 text-white transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full sm:-translate-x-full"}`}
            >
                <div className="flex items-center justify-between">
                    <Image src="/img/logo.png" alt="NewEra" width={64} height={64} />
                    <button className="h-10 w-10 text-3xl leading-none transition-opacity hover:opacity-75" type="button" aria-label="Закрыть меню" onClick={() => setIsOpen(false)}>
                        ×
                    </button>
                </div>
                <ul className="mt-10 flex flex-col gap-2 text-2xl">
                    {links.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                aria-current={link.active ? "page" : undefined}
                                className={`block border-l-2 py-2 pl-4 transition-colors hover:text-red-bright ${link.active ? "border-red-bright text-red-bright" : "border-transparent"}`}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className="mt-auto flex flex-col gap-3 border-t border-white/20 pt-6 text-lg">
                    <a className="hover:underline" href={VK_URL} target="_blank" rel="noopener noreferrer">Наш ВК</a>
                    <a className="hover:underline" href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">Мы в телеграмме</a>
                </div>
            </nav>
        </>
    )
}
