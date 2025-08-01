export default function FooterFoxFlat() {
    return (
        <footer className="w-full bg-black border-t border-neutral-800 py-6 px-4 text-center text-neutral-400 text-sm relative z-10">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
                <p>© {new Date().getFullYear()} FoxFlat. Всі права захищено.</p>
                <div className="flex gap-4 flex-wrap justify-center">
                    <a href="/terms-of-service" className="hover:text-orange-300 transition">
                        Договір публічної оферти
                    </a>
                    <a href="/privacy-policy" className="hover:text-orange-300 transition">
                        Політика конфіденційності
                    </a>
                    <a href="/acceptable-use-policy" className="hover:text-orange-300 transition">
                        Політика прийнятного використання
                    </a>
                    <a href="/contact" className="hover:text-orange-300 transition">
                        Контакти
                    </a>
                </div>
            </div>
        </footer>
    );
}