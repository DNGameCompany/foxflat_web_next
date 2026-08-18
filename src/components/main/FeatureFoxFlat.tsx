"use client";

import { motion } from "framer-motion";

const features = [
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 10a6 6 0 0 1 12 0c0 4 2 6 2 6H4s2-2 2-6" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                <circle cx="18" cy="5" r="3" fill="#FF6B35" stroke="none" />
            </svg>
        ),
        title: "Миттєві сповіщення",
        description: "Отримуй нові квартири одразу після публікації — у Києві, Львові, Одесі та інших містах.",
        tag: "Real-time",
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 5h18M6 10h12M9 15h6M11 20h2" />
            </svg>
        ),
        title: "Гнучкі фільтри",
        description: "Фільтруй за ціною, районом, кімнатами. Бот запам'ятає налаштування і застосує автоматично.",
        tag: "Персоналізація",
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
        ),
        title: "Бронювання першим",
        description: "Ти серед перших, хто бачить нове оголошення — встигаєш зв'язатись з власником до інших.",
        tag: "Перевага",
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
            </svg>
        ),
        title: "Цілодобова робота",
        description: "FoxFlat працює 24/7 і надсилає нові оголошення навіть вночі — без вихідних.",
        tag: "24/7",
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
        ),
        title: "Оновлення в реальному часі",
        description: "Моніторинг популярних платформ кожні 15 хвилин. Жодне оголошення не пропустиш.",
        tag: "Кожні 15 хв",
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
        ),
        title: "Прямо в Telegram",
        description: "Всі квартири — одразу в Telegram. Без зайвих застосунків, без реєстрації на сайтах.",
        tag: "Telegram",
    },
];

export default function FeatureFoxFlat() {
    return (
        <section className="relative py-24 px-6 overflow-hidden bg-[#1E1E2E] text-white">
            {/* Фонове підсвічування */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] pointer-events-none"
                style={{ background: "radial-gradient(ellipse, rgba(255,107,53,0.08) 0%, transparent 65%)" }}
            />

            <div className="relative max-w-6xl mx-auto">

                {/* Заголовок */}
                <div className="max-w-2xl mx-auto text-center mb-16">
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-xs font-extrabold tracking-widest text-[#FF6B35] uppercase mb-3"
                    >
                        Переваги FoxFlat
                    </motion.p>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="font-extrabold leading-tight mb-5 text-white"
                        style={{
                            fontFamily: "'Unbounded', sans-serif",
                            fontSize: "clamp(26px, 3.5vw, 42px)",
                            letterSpacing: "-1px",
                        }}
                    >
                        Все що потрібно для{" "}
                        <span className="text-[#FF6B35]">оренди квартири через Telegram</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 }}
                        className="text-white/70 text-base leading-relaxed"
                    >
                        FoxFlat перевіряє популярні платформи і надсилає оновлення у 22 містах України.
                        Більше не потрібно витрачати години на пошук.
                    </motion.p>
                </div>

                {/* Сітка функцій */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: i * 0.07 }}
                            className="group relative flex flex-col gap-4 p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-[#FF6B35]/60 hover:bg-white/[0.08] transition-all duration-300 overflow-hidden shadow-lg"
                        >
                            {/* Верхня підсвітка межі при наведенні */}
                            <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#FF6B35] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                            {/* М'який градієнтний куток */}
                            <div
                                className="absolute top-0 left-0 w-32 h-32 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{ background: "radial-gradient(circle at 0% 0%, rgba(255,107,53,0.15) 0%, transparent 70%)" }}
                            />

                            {/* Іконка */}
                            <div className="inline-flex p-3 rounded-xl bg-[#FF6B35]/15 border border-[#FF6B35]/25 text-[#FF6B35] self-start group-hover:bg-[#FF6B35] group-hover:text-white transition-colors duration-300">
                                {f.icon}
                            </div>

                            {/* Текст */}
                            <div className="relative z-10">
                                <h3
                                    className="font-bold text-white mb-2 leading-snug"
                                    style={{ fontFamily: "'Unbounded', sans-serif", fontSize: "15px" }}
                                >
                                    {f.title}
                                </h3>
                                <p className="text-sm text-white/60 leading-relaxed">
                                    {f.description}
                                </p>
                            </div>

                            {/* Тег */}
                            <div className="mt-auto relative z-10 pt-2">
                                <span className="text-[10px] font-extrabold text-[#FF6B35] tracking-widest uppercase">
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