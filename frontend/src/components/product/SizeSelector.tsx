"use client"

import { useState } from "react"

type SizeSelectorProps = {
    sizes: string[]
}

export function SizeSelector({ sizes }: SizeSelectorProps) {
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <div className="flex gap-2 mt-6">
            {sizes.map((size) => (
                <button
                    key={size}
                    type="button"
                    onClick={() => setSelected(size)}
                    aria-pressed={size === selected}
                    className={`border border-red-bright px-4 py-2 ${size === selected ? "bg-red-bright text-white" : ""}`}
                >
                    {size}
                </button>
            ))}
        </div>
    )
}
