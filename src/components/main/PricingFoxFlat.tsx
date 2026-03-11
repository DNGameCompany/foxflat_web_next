"use client";

import { motion } from "framer-motion";
import { event } from "@/lib/gtag";

const freeFeatures = [
    "Базовий пошук квартир у вибраному місті",
    "Основні фільтри (ціна та кількість кімнат)",
    "Сповіщення про нові квартири кожні 30 хвилин",
    "Зміна параметрів пошуку 1 раз на добу",
    "До 3 переходів на оголошення щодня"
];

const premiumFeatures = [
    "Релевантні квартири у стрічці",
    "Можливість зберігати обрані квартири",
    "Необмежена зміна параметрів пошуку",
    "Повний набір фільтрів (місто, район, площа, поверх, кімнати)",
    "Можливість використовувати кілька значень у фільтрах",
    "Перевірка нових оголошень кожні 15 хвилин",
    "Миттєві сповіщення про нові квартири (кожні 3 хвилини)",
    "Необмежена кількість переходів на оголошення",
    "Перегляд поточних фільтрів",
    "Повний доступ до налаштувань",
    "Підтримка користувачів",
    "Можливість залишити відгук"
];

const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5">
        <circle cx="8" cy="8" r="7.5" stroke="rgba(249,115,22,0.3)" />
        <path d="M5 8l2.5 2.5L11 5.5" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CheckIconSmall = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5">
        <path d="M4 8l3 3 5-6" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function PricingFoxFlat() {
    const handleBotClick = (action: string, label: string) => {
        event({ action, category: "engagement", label });
    };

    return (
        <section className="relative py-28 px-6 overflow-hidden">

            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] pointer-events-none"
                style={{ background: "radial-gradient(ellipse, rgba(249,115,22,0.06) 0%, transparent 65%)" }}
            />

            <div className="relative max-w-5xl mx-auto">

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center text-xs font-bold tracking-widest text-orange-500 uppercase mb-4"
                >
                    FoxFlat Підписка
                </motion.p>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center font-black mb-4 leading-tight"
                    style={{
                        fontFamily: "'Unbounded', sans-serif",
                        fontSize: "clamp(26px, 3.5vw, 42px)",
                        letterSpacing: "-1px",
                    }}
                >
                    Швидкий доступ до нових квартир
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                    className="text-center text-white/40 text-base max-w-md mx-auto mb-10 leading-relaxed"
                >
                    Обери план і отримуй нові оголошення першим
                </motion.p>

                {/* Банер акції */} <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="relative mb-12 mx-auto max-w-2xl" > {/* gradient border */} <div className="absolute inset-0 rounded-2xl" style={{ padding: "1px", background: "linear-gradient(135deg, rgba(249,115,22,0.55), rgba(249,115,22,0.1), rgba(249,115,22,0.45))" }}> </div> <div className="relative rounded-2xl bg-[#0f0f0f] overflow-hidden"> {/* glow left */} <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 0% 50%, rgba(249,115,22,0.1) 0%, transparent 55%)" }} /> <div className="relative flex items-center gap-5 px-7 py-5"> {/* іконка подарунку */} <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center text-orange-400"> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"> <polyline points="20 12 20 22 4 22 4 12" /> <rect x="2" y="7" width="20" height="5" rx="1" /> <line x1="12" y1="22" x2="12" y2="7" /> <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /> <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /> </svg> </div> {/* текст */} <div className="flex-1 min-w-0"> <p className="text-white font-bold text-sm mb-1" style={{ fontFamily: "'Unbounded', sans-serif" }}> Преміум зараз безкоштовно </p> <p className="text-white/40 text-xs leading-relaxed"> Звичайна вартість{" "} <span className="line-through text-white/25">200 грн/міс</span> {" "}— отримай повний доступ без оплати </p> </div> {/* бейдж */} <div className="flex-shrink-0 hidden sm:block"> <span className="text-[10px] font-black text-orange-500 border border-orange-500/40 bg-orange-500/10 px-3 py-1.5 rounded-full tracking-widest uppercase" style={{ fontFamily: "'Unbounded', sans-serif" }}> 0 грн </span> </div> </div> </div> </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.7fr] gap-4 items-stretch">

                    {/* FREE */}

                    <motion.div
                        initial={{ opacity: 0, x: -24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex flex-col p-7 rounded-2xl border border-white/[0.08] bg-white/[0.02]"
                    >

                        <div className="mb-6">
                            <p className="text-xs font-bold tracking-widest text-white/40 uppercase mb-3">
                                Безкоштовно
                            </p>

                            <div className="flex items-end gap-1">
                                <span className="font-black text-white leading-none text-[40px]">
                                    0
                                </span>
                                <span className="text-white/40 text-sm mb-1.5 font-medium">
                                    грн / міс
                                </span>
                            </div>
                        </div>

                        <p className="text-sm text-white/40 leading-relaxed mb-7">
                            Спробуй сервіс та отримуй нові оголошення про квартири.
                        </p>

                        <ul className="flex flex-col gap-3 mb-8 flex-1">
                            {freeFeatures.map((f) => (
                                <li key={f} className="flex items-start gap-2.5 text-sm text-white/50">
                                    <CheckIconSmall />
                                    {f}
                                </li>
                            ))}
                        </ul>

                        <a
                            href="https://t.me/FoxFlat_bot?start=website"
                            target="_blank"
                            onClick={() => handleBotClick("tier-free", "Безкоштовно")}
                            className="block text-center text-sm font-bold text-orange-500 border border-orange-500 px-4 py-3 rounded-xl"
                        >
                            Спробувати безкоштовно
                        </a>

                    </motion.div>

                    {/* PREMIUM */}

                    <motion.div
                        initial={{ opacity: 0, x: 24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative flex flex-col p-8 rounded-2xl border border-orange-500/40 bg-orange-500/[0.04]"
                    >

                        <div className="absolute top-6 right-6">
                            <span className="text-[10px] font-bold text-black bg-orange-500 px-3 py-1.5 rounded-full">
                                ПОПУЛЯРНИЙ
                            </span>
                        </div>

                        <div className="mb-6">
                            <p className="text-xs font-bold tracking-widest text-orange-500 uppercase mb-3">
                                Місячна підписка
                            </p>

                            <div className="flex items-end gap-2 mb-1">
                                <span className="font-black text-white text-[56px] leading-none">
                                    0
                                </span>

                                <div className="mb-2">
                                    <span className="text-white/40 text-sm block">
                                        грн / міс
                                    </span>
                                    <span className="text-white/25 text-xs line-through">
                                        200 грн
                                    </span>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-white/50 leading-relaxed mb-8 max-w-sm">
                            Отримуй нові оголошення раніше за інших та знаходь квартири швидше.
                        </p>

                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-10 flex-1">
                            {premiumFeatures.map((f) => (
                                <li key={f} className="flex items-start gap-2.5 text-sm text-white/70">
                                    <CheckIcon />
                                    {f}
                                </li>
                            ))}
                        </ul>

                        <a
                            href="https://t.me/FoxFlat_bot?start=website"
                            target="_blank"
                            onClick={() => handleBotClick("tier-premium", "Місячна підписка")}
                            className="block text-center font-bold text-black bg-orange-500 hover:bg-transparent hover:text-orange-500 border-2 border-orange-500 px-6 py-4 rounded-xl transition-all"
                        >
                            Оформити підписку →
                        </a>

                    </motion.div>

                </div>
            </div>
        </section>
    );
}