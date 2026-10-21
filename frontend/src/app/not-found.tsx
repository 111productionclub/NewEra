import Link from "next/link"

export default function NotFound() {
    return (
        <main className="flex flex-col items-center px-4 py-16 text-center sm:py-24">
            <p className="text-7xl text-red-text text-stroke sm:text-[120px] sm:leading-none">404</p>
            <h1 className="mt-4 text-xl sm:text-3xl text-stroke">Такой страницы нет</h1>
            <p className="mt-2 text-sm sm:text-lg">Возможно, вещь уже разобрали или ссылка устарела.</p>
            <Link href="/" className="mt-8 rounded-[11px] border border-black bg-red px-5 py-3 text-white transition hover:brightness-125 active:scale-95">
                В каталог
            </Link>
        </main>
    )
}
