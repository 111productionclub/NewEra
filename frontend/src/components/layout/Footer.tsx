
export function Footer() {
    return (
        <footer className="py-16">
            <div className="flex flex-col items-center gap-2 md:flex-row md:justify-center md:gap-6 mx-4 md:mx-auto md:max-w-5xl border-t border-grey pt-10">
                <a className="hover:underline" href="https://vk.ru/new_erashop" target="_blank" rel="noopener noreferrer"> Наш ВК </a>
                <a className="hover:underline" href="https://telegram.me/myneweralive" target="_blank" rel="noopener noreferrer"> Мы в телеграмме </a>
            </div>
            <div className="mt-8 text-center text-sm">
                сделано с <span>♥ </span>
                <a className="hover:underline font-bold" rel="noopener noreferrer" href="https://t.me/III_cult" target="_blank">111 Production Club</a>
            </div>
        </footer>
    );
}