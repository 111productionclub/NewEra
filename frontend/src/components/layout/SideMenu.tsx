"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"


export function SideMenu(){
    const [isOpen, setIsOpen] = useState(false)
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

    return(
        <>
            <button className="flex h-12 w-12 items-center justify-center transition-opacity hover:opacity-75" type="button" aria-label="Меню" aria-expanded={isOpen} onClick={() => setIsOpen(true)}>
                <Image className="h-[45px] w-[45px] sm:h-[37px] sm:w-[37px]" src="/icons/menu.svg" alt="" width={37} height={37} />
            </button>
            <div className={`fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={() => setIsOpen(false)} />
            <nav className={`flex flex-col gap-4 p-6 fixed top-0 right-0 sm:right-auto sm:left-0 h-full w-64 bg-white z-40 transition-transform ${isOpen ? "translate-x-0" : "translate-x-full sm:-translate-x-full"}`}>
                <Link href="/about" onClick={() => setIsOpen(false)}>
                    <p>О бренде</p>
                </Link>                
                <Link href="/" onClick={() => setIsOpen(false)}>
                    <p>Каталог</p>
                </Link>
            </nav>
        </>
    )
    
}