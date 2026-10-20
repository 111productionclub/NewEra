


type SizeSelectorProps = {
    sizes: string[]
    selected: string | null
    onSelect: (size: string) => void
}

export function SizeSelector({ sizes, selected, onSelect }: SizeSelectorProps) {
    return (
        <div className="flex gap-2 mt-6">
            {sizes.map((size) => (
                <button
                    key={size}
                    type="button"
                    onClick={() => onSelect(size)}
                    aria-pressed={size === selected}
                    className={`border border-red-bright px-4 py-2 ${size === selected ? "bg-red-bright text-white" : ""}`}
                >
                    {size}
                </button>
            ))}
        </div>
    )
}
