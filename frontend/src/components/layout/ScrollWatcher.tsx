"use client"

import { useEffect } from "react"

const ON_AT = 80
const OFF_AT = 10

export function ScrollWatcher() {
    useEffect(() => {
        const root = document.documentElement
        const update = () => {
            const y = window.scrollY
            if (y > ON_AT) root.setAttribute("data-scrolled", "")
            else if (y < OFF_AT) root.removeAttribute("data-scrolled")
        }
        update()
        window.addEventListener("scroll", update, { passive: true })
        return () => {
            window.removeEventListener("scroll", update)
            root.removeAttribute("data-scrolled")
        }
    }, [])

    return null
}
