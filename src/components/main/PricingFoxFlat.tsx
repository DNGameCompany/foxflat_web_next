"use client";

import { motion } from "framer-motion";
import { event } from "@/lib/gtag";

const freeFeatures = [
    "Пошук квартир у вибраному місті",
    "Фільтр за ціною та площею — стандартні діапазони",
    "Кількість кімнат — лише одне значення",
    "Район недоступний без підписки",
    "Сповіщення кожні 30 хвилин",
    "До 3 переходів на оголошення щодня",
];

const premiumFeatures = [
    "Релевантні квартири у стрічці",
    "Збереження обраних квартир",
    "Повний набір фільтрів (район, поверх, площа)",
    "Власні діапазони ціни та площі",
    "Кілька значень у фільтрах одночасно",
    "Перевірка оголошень кожні 15 хвилин",
    "Миттєві сповіщення (кожні 3 хв)",
    "Необмежена кількість переходів",
    "Перегляд поточних фільтрів",
    "Повний доступ до налаштувань",
    "Підтримка + можливість залишити відгук",
];

const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5">
        <circle cx="8" cy="8" r="7.5" stroke="rgba(255,107,53,0.3)" />
        <path d="M5 8l2.5 2.5L11 5.5" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CheckIconSmall = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5">
        <path d="M4 8l3 3 5-6" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function PricingFoxFlat() {
    const handleBotClick = (action: string, label: string) => {
        event({ action, category: "engagement", label });
    };

    return (
        <section className="relative py-24 px-6 overflow-hidden bg-[#1E1E2E] text-white">
            {/* М'яке фонове сяйво */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] pointer-events-none"
                style={{ background: "radial-gradient(ellipse, rgba(255,107,53,0.08) 0%, transparent 65%)" }}
            />

            <div className="relative max-w-5xl mx-auto">
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center text-xs font-extrabold tracking-widest text-[#FF6B35] uppercase mb-3"
                >
                    FoxFlat Підписка
                </motion.p>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center font-extrabold mb-4 leading-tight text-white"
                    style={{
                        fontFamily: "'Unbounded', sans-serif",
                        fontSize: "clamp(26px, 3.5vw, 42px)",
                        letterSpacing: "-1px",
                    }}
                >
                    Тарифи FoxFlat
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                    className="text-center text-white/60 text-base max-w-md mx-auto mb-16 leading-relaxed"
                >
                    Обери план і отримуй нові оголошення першим
                </motion.p>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-6 items-stretch">

                    {/* FREE */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col p-8 rounded-2xl border border-white/10 bg-white/5 shadow-xl hover:border-white/20 transition-all duration-300"
                    >
                        <div className="mb-6">
                            <p className="text-xs font-extrabold tracking-widest text-white/40 uppercase mb-3">
                                Безкоштовно
                            </p>
                            <div className="flex items-end gap-1.5">
                                <span className="font-extrabold text-white text-[42px] leading-none" style={{ fontFamily: "'Unbounded', sans-serif" }}>0</span>
                                <span className="text-white/40 font-semibold text-sm mb-1.5">грн</span>
                            </div>
                        </div>

                        <p className="text-sm text-white/60 mb-8 leading-relaxed">
                            Спробуй сервіс і подивись, як працюють сповіщення.
                        </p>

                        <ul className="flex flex-col gap-3 mb-8 flex-1">
                            {freeFeatures.map((f) => (
                                <li key={f} className="flex items-start gap-2.5 text-sm text-white/70">
                                    <CheckIconSmall />
                                    {f}
                                </li>
                            ))}
                        </ul>

                        <a
                            href="https://t.me/FoxFlat_bot?start=website"
                            target="_blank"
                            onClick={() => handleBotClick("tier-free", "Безкоштовно")}
                            className="block text-center text-xs font-bold text-[#FF6B35] border border-[#FF6B35]/60 px-4 py-3.5 rounded-xl hover:bg-[#FF6B35]/10 hover:border-[#FF6B35] transition-all duration-200"
                            style={{ fontFamily: "'Unbounded', sans-serif" }}
                        >
                            Відкрити у Telegram
                        </a>
                    </motion.div>

                    {/* PREMIUM (один блок + два тарифи) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="relative flex flex-col p-8 rounded-2xl border border-[#FF6B35]/50 bg-white/[0.07] shadow-2xl overflow-hidden"
                    >
                        <div className="absolute top-6 right-6">
                            <span className="text-[10px] font-extrabold text-white bg-[#FF6B35] px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                                Рекомендуємо
                            </span>
                        </div>

                        <div className="mb-6">
                            <p className="text-xs font-extrabold tracking-widest text-[#FF6B35] uppercase mb-4">
                                Преміум
                            </p>

                            {/* Два тарифи поруч */}
                            <div className="grid grid-cols-2 gap-4 mb-2">
                                {/* Тижневий */}
                                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center hover:border-white/20 transition-all duration-200">
                                    <p className="text-[11px] font-bold text-white/50 uppercase tracking-wider mb-2">7 днів</p>
                                    <div className="flex items-end justify-center gap-1 mb-3">
                                        <span className="font-extrabold text-white text-[32px] leading-none" style={{ fontFamily: "'Unbounded', sans-serif" }}>99</span>
                                        <span className="text-white/40 font-semibold text-xs mb-1">грн</span>
                                    </div>
                                    <a
                                        href="https://t.me/FoxFlat_bot?start=website_premium"
                                        target="_blank"
                                        onClick={() => handleBotClick("tier-weekly", "Тижнева підписка")}
                                        className="block text-xs font-bold text-[#FF6B35] border border-[#FF6B35]/50 rounded-lg py-2 hover:bg-[#FF6B35]/15 transition-all duration-200"
                                        style={{ fontFamily: "'Unbounded', sans-serif" }}
                                    >
                                        Обрати
                                    </a>
                                </div>

                                {/* Місячний */}
                                <div className="rounded-xl border border-[#FF6B35]/60 bg-[#FF6B35]/10 p-4 text-center relative shadow-inner">
                                    <p className="text-[11px] font-extrabold text-[#FF6B35] uppercase tracking-wider mb-2">Місяць</p>
                                    <div className="flex items-end justify-center gap-1 mb-3">
                                        <span className="font-extrabold text-white text-[32px] leading-none" style={{ fontFamily: "'Unbounded', sans-serif" }}>199</span>
                                        <span className="text-white/40 font-semibold text-xs mb-1">грн</span>
                                    </div>
                                    <a
                                        href="https://t.me/FoxFlat_bot?start=website_premium"
                                        target="_blank"
                                        onClick={() => handleBotClick("tier-premium", "Місячна підписка")}
                                        className="block text-xs font-bold text-white bg-[#FF6B35] hover:bg-[#e05a2b] rounded-lg py-2 transition-all duration-200 shadow-md"
                                        style={{ fontFamily: "'Unbounded', sans-serif" }}
                                    >
                                        Обрати
                                    </a>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm font-semibold text-white/70 mb-6 leading-relaxed">
                            Усі можливості нижче доступні в обох тарифах:
                        </p>

                        {/* Список можливостей */}
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-2 flex-1">
                            {premiumFeatures.map((f) => (
                                <li key={f} className="flex items-start gap-2.5 text-sm text-white/80">
                                    <CheckIcon />
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}