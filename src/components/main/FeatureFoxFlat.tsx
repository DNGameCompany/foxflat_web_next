"use client";

import { motion } from "framer-motion";

const features = [
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 10a6 6 0 0 1 12 0c0 4 2 6 2 6H4s2-2 2-6" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                <circle cx="18" cy="5" r="3" fill="#F97316" stroke="none" />
            </svg>
        ),
        title: "Нові оголошення без ручного пошуку",
        description: "Бот перевіряє платформи кожні 15 хвилин і надсилає нові квартири, що підходять під твої фільтри. Якщо нових немає, сповіщень не буде.",
        tag: "Кожні 15 хв",
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 5h18M6 10h12M9 15h6M11 20h2" />
            </svg>
        ),
        title: "Налаштуй один раз",
        description: "Вкажи місто, ціну та кількість кімнат — бот запамʼятає і надсилатиме лише те, що підходить. У Premium також район, площа та поверх.",
        tag: "Персоналізація",
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
        ),
        title: "Не треба оновлювати сайти",
        description: "Бот сам стежить за платформами, а ти отримуєш нові оголошення в Telegram. Щоб звʼязатися з автором, переходиш за посиланням на сайт, де було опубліковано оголошення.",
        tag: "Перевага",
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
            </svg>
        ),
        title: "Працює цілодобово",
        description: "FoxFlat стежить за оголошеннями 24/7, навіть вночі та у вихідні, поки ти займаєшся своїми справами.",
        tag: "24/7",
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="3" y1="3" x2="21" y2="21" />
            </svg>
        ),
        title: "Бот, а не каталог",
        description: "FoxFlat не зберігає архів і не має бази для перегляду. Він надсилає лише нові оголошення, які зʼявилися після налаштування фільтрів.",
        tag: "Тільки нові",
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
        ),
        title: "Прямо в Telegram",
        description: "Нові оголошення приходять просто в чат. Без зайвих застосунків і реєстрації на сайтах.",
        tag: "Telegram",
    },
];

export default function FeatureFoxFlat() {
    return (
        <section className="relative py-28 px-6 overflow-hidden">
            {/* bg glow центр */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] pointer-events-none"
                style={{ background: "radial-gradient(ellipse, rgba(249,115,22,0.05) 0%, transparent 65%)" }}
            />

            <div className="relative max-w-6xl mx-auto">

                {/* Header */}
                <div className="max-w-2xl mx-auto text-center mb-20">
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-xs font-bold tracking-widest text-orange-500 uppercase mb-4"
                    >
                        Переваги FoxFlat
                    </motion.p>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="font-black leading-tight mb-5"
                        style={{
                            fontFamily: "'Unbounded', sans-serif",
                            fontSize: "clamp(26px, 3.5vw, 42px)",
                            letterSpacing: "-1px",
                        }}
                    >
                        Як FoxFlat допомагає{" "}
                        <span className="text-orange-500">не пропустити квартиру</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 }}
                        className="text-white/40 text-base leading-relaxed"
                    >
                        FoxFlat стежить за популярними платформами у 22 містах України
                        і надсилає тобі нові оголошення за твоїми фільтрами.
                    </motion.p>
                </div>

                {/* Grid фічей */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04] rounded-3xl overflow-hidden border border-white/[0.04]">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: i * 0.07 }}
                            className="group relative flex flex-col gap-4 p-8 bg-black hover:bg-white/[0.025] transition-colors duration-300 overflow-hidden"
                        >
                            {/* top-border highlight on hover */}
                            <div className="absolute top-0 left-0 right-0 h-px bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                            {/* glow corner */}
                            <div
                                className="absolute top-0 left-0 w-32 h-32 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{ background: "radial-gradient(circle at 0% 0%, rgba(249,115,22,0.08) 0%, transparent 70%)" }}
                            />

                            {/* Іконка */}
                            <div className="inline-flex p-3 rounded-xl bg-orange-500/10 border border-orange-500/15 text-orange-400 self-start group-hover:bg-orange-500/15 transition-colors duration-300">
                                {f.icon}
                            </div>

                            {/* Текст */}
                            <div>
                                <h3
                                    className="font-bold text-white mb-2 leading-snug"
                                    style={{ fontFamily: "'Unbounded', sans-serif", fontSize: "14px" }}
                                >
                                    {f.title}
                                </h3>
                                <p className="text-sm text-white/40 leading-relaxed">
                                    {f.description}
                                </p>
                            </div>

                            {/* Tag */}
                            <div className="mt-auto">
                                <span className="text-[10px] font-bold text-orange-500/70 tracking-widest uppercase">
                                    {f.tag}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}