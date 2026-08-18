"use client";

import Link from "next/link";
import { event } from "@/lib/gtag";

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
    const handleBotClick = (action: string, label: string) => {
        event({ action, category: "engagement", label });
    };

    return (
        <footer className="w-full bg-[#1E1E2E] text-white pt-12 pb-8 px-6 relative z-10 overflow-hidden">
            {/* Верхній градієнтний розділювач */}
            <div
                className="w-full h-px mb-12"
                style={{ background: "linear-gradient(to right, transparent, rgba(255,107,53,0.4), transparent)" }}
            />

            <div className="max-w-5xl mx-auto space-y-10">

                {/* Міста + Інструменти + Наші проєкти */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Міста */}
                    <div className="md:col-span-2">
                        <p
                            className="text-[11px] font-extrabold tracking-[0.15em] text-[#FF6B35] uppercase mb-4"
                            style={{ fontFamily: "'Unbounded', sans-serif" }}
                        >
                            Оренда по містах
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-2.5">
                            {CITIES.map((city) => (
                                <Link
                                    key={city.slug}
                                    href={`/misto/${city.slug}`}
                                    className="text-xs text-white/60 hover:text-[#FF6B35] transition-colors duration-200"
                                >
                                    {city.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Інструменти */}
                    <div className="space-y-3">
                        <p
                            className="text-[11px] font-extrabold tracking-[0.15em] text-[#FF6B35] uppercase mb-4"
                            style={{ fontFamily: "'Unbounded', sans-serif" }}
                        >
                            Інструменти
                        </p>
                        <Link href="/tools/calculator" className="text-xs text-white/60 hover:text-[#FF6B35] transition-colors duration-200 block">
                            Калькулятор оренди
                        </Link>
                        <Link href="/tools/checklist" className="text-xs text-white/60 hover:text-[#FF6B35] transition-colors duration-200 block">
                            Чеклист огляду квартири
                        </Link>
                    </div>

                    {/* Наші проєкти */}
                    <div className="space-y-3">
                        <p
                            className="text-[11px] font-extrabold tracking-[0.15em] text-[#FF6B35] uppercase mb-4"
                            style={{ fontFamily: "'Unbounded', sans-serif" }}
                        >
                            Наші проєкти
                        </p>
                        <a
                            href="https://t.me/FoxFlat_bot"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => handleBotClick("ecosystem_foxflat_click", "Footer — FoxFlat link")}
                            className="text-xs text-white/60 hover:text-[#FF6B35] transition-colors duration-200 block"
                        >
                            FoxFlat — оренда квартир
                        </a>
                        <a
                            href="https://t.me/FoxHunts_bot"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => handleBotClick("ecosystem_foxhunt_click", "Footer — FoxHunt link")}
                            className="text-xs text-white/60 hover:text-[#FF6B35] transition-colors duration-200 block"
                        >
                            FoxHunt — фріланс-проєкти
                        </a>
                    </div>

                </div>

                {/* Розділювач */}
                <div className="h-px bg-white/10" />

                {/* Нижня частина */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50">
                    <p>© {new Date().getFullYear()} FoxFlat. Всі права захищено.</p>
                    <div className="flex gap-4 flex-wrap justify-center">
                        <Link href="/legal/terms-of-service" className="hover:text-[#FF6B35] transition-colors duration-200">
                            Договір публічної оферти
                        </Link>
                        <Link href="/legal/privacy-policy" className="hover:text-[#FF6B35] transition-colors duration-200">
                            Політика конфіденційності
                        </Link>
                        <Link href="/legal/acceptable-use-policy" className="hover:text-[#FF6B35] transition-colors duration-200">
                            Політика прийнятного використання
                        </Link>
                        <Link href="/reviews" className="hover:text-[#FF6B35] transition-colors duration-200">
                            Відгуки
                        </Link>
                        <Link href="/contacts" className="hover:text-[#FF6B35] transition-colors duration-200">
                            Контакти
                        </Link>
                        <Link href="/blog" className="hover:text-[#FF6B35] transition-colors duration-200">
                            Блог
                        </Link>
                    </div>
                </div>

            </div>
        </footer>
    );
}