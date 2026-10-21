


type SizeSelectorProps = {
    sizes: string[]
    selected: string | null
    onSelect: (size: string) => void
}

export function SizeSelector({ sizes, selected, onSelect }: SizeSelectorProps) {
    return (
        <div className="flex gap-[7px] sm:gap-[22px] mt-3 sm:mt-[57px]">
            {sizes.map((size) => (
                <button
                    key={size}
                    type="button"
                    onClick={() => onSelect(size)}
                    aria-pressed={size === selected}
                    className={`h-[29px] sm:h-[58px] px-1.5 sm:px-7 rounded-[11px] border border-black text-sm sm:text-2xl text-stroke transition-colors ${size === selected ? "bg-black text-white" : "bg-white hover:bg-[#f1f1f1]"}`}
                >
                    {size}
                </button>
            ))}
        </div>
    )
}
