import Link from "next/link";

const CITIES = [
    { slug: "kyiv",            name: "Київ" },
    { slug: "lviv",            name: "Львів" },
    { slug: "odesa",           name: "Одеса" },
    { slug: "kharkiv",         name: "Харків" },
    { slug: "dnipro",          name: "Дніпро" },
    { slug: "zaporizhzhia",    name: "Запоріжжя" },
    { slug: "vinnytsia",       name: "Вінниця" },
    { slug: "mykolaiv",        name: "Миколаїв" },
    { slug: "kherson",         name: "Херсон" },
    { slug: "chernihiv",       name: "Чернігів" },
    { slug: "poltava",         name: "Полтава" },
    { slug: "cherkasy",        name: "Черкаси" },
    { slug: "sumy",            name: "Суми" },
    { slug: "zhytomyr",        name: "Житомир" },
    { slug: "rivne",           name: "Рівне" },
    { slug: "lutsk",           name: "Луцьк" },
    { slug: "ternopil",        name: "Тернопіль" },
    { slug: "khmelnytskyi",    name: "Хмельницький" },
    { slug: "kropyvnytskyi",   name: "Кропивницький" },
    { slug: "uzhhorod",        name: "Ужгород" },
    { slug: "ivano-frankivsk", name: "Івано-Франківськ" },
    { slug: "chernivtsi",      name: "Чернівці" },
];



export default function FooterFoxFlat() {
    return (
        <footer className="w-full bg-black pt-10 pb-6 px-4 relative z-10">
            {/* Розділювач */}
            <div className="w-full h-px mb-10"
                 style={{ background: "linear-gradient(to right, transparent, rgba(249,115,22,0.3), transparent)" }} />

            <div className="max-w-5xl mx-auto space-y-8">

                {/* Міста + Блог */}
                <div className="grid grid-cols-1 gap-8">

                    {/* Міста */}
                    <div className="">
                        <p className="text-[10px] font-bold tracking-[0.15em] text-white/20 uppercase mb-4">
                            Оренда по містах
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                            {CITIES.map((city) => (
                                <Link key={city.slug} href={`/misto/${city.slug}`}
                                      className="text-xs text-white/30 hover:text-orange-400 transition-colors">
                                    {city.name}
                                </Link>
                            ))}
                        </div>
                    </div>



                </div>

                {/* Розділювач */}
                <div className="h-px bg-white/[0.05]" />

                {/* Нижня частина */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-white/25">
                    <p>© {new Date().getFullYear()} FoxFlat. Всі права захищено.</p>
                    <div className="flex gap-4 flex-wrap justify-center">
                        <Link href="/legal/terms-of-service" className="hover:text-orange-300 transition-colors">
                            Договір публічної оферти
                        </Link>
                        <Link href="/legal/privacy-policy" className="hover:text-orange-300 transition-colors">
                            Політика конфіденційності
                        </Link>
                        <Link href="/legal/acceptable-use-policy" className="hover:text-orange-300 transition-colors">
                            Політика прийнятного використання
                        </Link>
                        <Link href="/contacts" className="hover:text-orange-300 transition-colors">
                            Контакти
                        </Link>
                        <Link href="/blog" className="hover:text-orange-300 transition-colors">
                            Блог
                        </Link>
                    </div>
                </div>

            </div>
        </footer>
    );
}