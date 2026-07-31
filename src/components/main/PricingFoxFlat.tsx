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
                    Тарифи FoxFlat
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                    className="text-center text-white/40 text-base max-w-md mx-auto mb-12 leading-relaxed"
                >
                    Обери план і отримуй нові оголошення першим
                </motion.p>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-5 items-stretch">

                    {/* FREE */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col p-7 rounded-2xl border border-white/[0.08] bg-white/[0.02]"
                    >
                        <div className="mb-5">
                            <p className="text-xs font-bold tracking-widest text-white/40 uppercase mb-3">
                                Безкоштовно
                            </p>
                            <div className="flex items-end gap-1.5">
                                <span className="font-black text-white text-[42px] leading-none">0</span>
                                <span className="text-white/40 text-sm mb-1.5">грн</span>
                            </div>
                        </div>

                        <p className="text-sm text-white/40 mb-7 leading-relaxed">
                            Спробуй сервіс і подивись, як працюють сповіщення.
                        </p>

                        <ul className="flex flex-col gap-2.5 mb-8 flex-1">
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
                            className="block text-center text-sm font-bold text-orange-500 border border-orange-500/60 px-4 py-3.5 rounded-xl hover:bg-orange-500/10 transition-all"
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
                        className="relative flex flex-col p-7 sm:p-8 rounded-2xl border border-orange-500/35 bg-orange-500/[0.04]"
                    >
                        <div className="absolute top-5 right-5">
              <span className="text-[10px] font-bold text-black bg-orange-500 px-3 py-1.5 rounded-full">
                РЕКОМЕНДУЄМО
              </span>
                        </div>

                        <div className="mb-6">
                            <p className="text-xs font-bold tracking-widest text-orange-500 uppercase mb-4">
                                Преміум
                            </p>

                            {/* Два тарифи поруч */}
                            <div className="grid grid-cols-2 gap-3 mb-1">
                                {/* Тижневий */}
                                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
                                    <p className="text-[11px] text-white/40 uppercase tracking-wider mb-2">7 днів</p>
                                    <div className="flex items-end justify-center gap-1">
                                        <span className="font-black text-white text-[32px] leading-none">99</span>
                                        <span className="text-white/40 text-xs mb-1">грн</span>
                                    </div>
                                    <a
                                        href="https://t.me/FoxFlat_bot?start=website_premium"
                                        target="_blank"
                                        onClick={() => handleBotClick("tier-weekly", "Тижнева підписка")}
                                        className="mt-3 block text-xs font-bold text-orange-500 border border-orange-500/50 rounded-lg py-2 hover:bg-orange-500/10 transition-all"
                                    >
                                        Обрати
                                    </a>
                                </div>

                                {/* Місячний */}
                                <div className="rounded-xl border border-orange-500/40 bg-orange-500/10 p-4 text-center relative">
                                    <p className="text-[11px] text-orange-400 uppercase tracking-wider mb-2">Місяць</p>
                                    <div className="flex items-end justify-center gap-1">
                                        <span className="font-black text-white text-[32px] leading-none">199</span>
                                        <span className="text-white/40 text-xs mb-1">грн</span>
                                    </div>
                                    <a
                                        href="https://t.me/FoxFlat_bot?start=website_premium"
                                        target="_blank"
                                        onClick={() => handleBotClick("tier-premium", "Місячна підписка")}
                                        className="mt-3 block text-xs font-bold text-black bg-orange-500 rounded-lg py-2 hover:bg-orange-400 transition-all"
                                    >
                                        Обрати
                                    </a>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-white/50 mb-6 leading-relaxed">
                            Усі можливості нижче доступні в обох тарифах.
                        </p>

                        {/* Список можливостей — один раз */}
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2.5 mb-2 flex-1">
                            {premiumFeatures.map((f) => (
                                <li key={f} className="flex items-start gap-2.5 text-sm text-white/70">
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