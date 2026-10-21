import Image from "next/image"
import { VK_URL, TELEGRAM_URL } from "@/config/site"

export function Footer() {
    return (
        <footer className="py-12 sm:py-16">
            <div className="mx-4 flex flex-col items-center gap-6 border-t border-grey pt-10 md:mx-auto md:max-w-5xl">
                <Image src="/img/logo.png" alt="NewEra" width={72} height={72} />
                <nav className="flex flex-col items-center gap-2 md:flex-row md:gap-8">
                    <a className="hover:underline" href={VK_URL} target="_blank" rel="noopener noreferrer"> Наш ВК </a>
                    <a className="hover:underline" href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer"> Мы в телеграмме </a>
                </nav>
            </div>
            <div className="mt-8 text-center text-sm">
                <p>© {new Date().getFullYear()} NewEra</p>
                <p className="mt-2">
                    сделано с <span>♥ </span>
                    <a className="hover:underline font-bold" rel="noopener noreferrer" href="https://t.me/III_cult" target="_blank">111 Production Club</a>
                </p>
            </div>
        </footer>
    );
}
