"use client";

import { motion } from "framer-motion";
import { event } from "@/lib/gtag";

const Check = ({ dim = false }: { dim?: boolean }) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="mx-auto flex-shrink-0">
        <circle cx="9" cy="9" r="8.5" stroke={dim ? "rgba(255,255,255,0.2)" : "rgba(249,115,22,0.5)"} />
        <path d="M5.5 9l2.5 2.5L12.5 6" stroke={dim ? "rgba(255,255,255,0.35)" : "#F97316"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const Dash = () => (
    <span className="block text-center text-white/30 text-lg leading-none">—</span>
);

type FeatureRow = {
    label: string;
    free: React.ReactNode;
    weekly: React.ReactNode;
    premium: React.ReactNode;
};

const features: FeatureRow[] = [
    {
        label: "Пошук квартир у місті",
        free: <Check />,
        weekly: <Check dim />,
        premium: <Check />,
    },
    {
        label: "Сповіщення про нові квартири",
        free: <span className="block text-center text-xs text-white/50">кожні 30 хв</span>,
        weekly: <Check dim />,
        premium: <span className="block text-center text-xs text-orange-400">кожні 3 хв</span>,
    },
    {
        label: "Фільтр за ціною та площею",
        free: <span className="block text-center text-xs text-white/50">стандартний</span>,
        weekly: <Check dim />,
        premium: <span className="block text-center text-xs text-orange-400">власні діапазони</span>,
    },
    {
        label: "Кількість кімнат",
        free: <span className="block text-center text-xs text-white/50">одне значення</span>,
        weekly: <Check dim />,
        premium: <span className="block text-center text-xs text-orange-400">кілька значень</span>,
    },
    {
        label: "Фільтр за районом",
        free: <Dash />,
        weekly: <Check dim />,
        premium: <Check />,
    },
    {
        label: "Фільтр за поверхом",
        free: <Dash />,
        weekly: <Check dim />,
        premium: <Check />,
    },
    {
        label: "Збереження квартир",
        free: <Dash />,
        weekly: <Check dim />,
        premium: <Check />,
    },
    {
        label: "Перегляд поточних фільтрів",
        free: <Check />,
        weekly: <Check dim />,
        premium: <Check />,
    },
    {
        label: "Необмежені переходи на оголошення",
        free: <span className="block text-center text-xs text-white/50">до 3 на день</span>,
        weekly: <Check dim />,
        premium: <Check />,
    },
    {
        label: "Підтримка",
        free: <Check />,
        weekly: <Check dim />,
        premium: <Check />,
    },
];

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

            <div className="relative max-w-4xl mx-auto">
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
                        fontSize: "clamp(24px, 3.5vw, 40px)",
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
                    className="text-center text-white/50 text-base max-w-md mx-auto mb-12 leading-relaxed"
                >
                    Обери план і отримуй нові оголошення першим
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="rounded-2xl border border-white/[0.12] overflow-hidden"
                >
                    {/* Шапка таблиці */}
                    <div className="grid grid-cols-[1fr_repeat(3,minmax(0,180px))] bg-white/[0.05]">
                        <div className="p-6 border-b border-white/[0.1]" />

                        {/* FREE */}
                        <div className="p-6 border-b border-l border-white/[0.1] text-center">
                            <p className="text-xs font-bold tracking-widest text-white/50 uppercase mb-3">
                                Безкоштовно
                            </p>
                            <div className="flex items-end justify-center gap-1">
                                <span className="font-black text-white text-[32px] leading-none">0</span>
                                <span className="text-white/40 text-xs mb-1">грн/міс</span>
                            </div>
                        </div>

                        {/* WEEKLY */}
                        <div className="p-6 border-b border-l border-white/[0.1] text-center">
                            <div className="flex justify-center mb-2">
                                <span
                                    className="text-[9px] font-bold text-white/50 border border-white/20 bg-white/8 px-2 py-1 rounded-full tracking-widest uppercase"
                                    style={{ fontFamily: "'Unbounded', sans-serif" }}
                                >
                                    Незабаром
                                </span>
                            </div>
                            <p className="text-xs font-bold tracking-widest text-white/40 uppercase mb-3">
                                Тижнева
                            </p>
                            <div className="flex items-end justify-center gap-1">
                                <span className="font-black text-white/50 text-[32px] leading-none">99</span>
                                <span className="text-white/30 text-xs mb-1">грн/7 днів</span>
                            </div>
                        </div>

                        {/* PREMIUM */}
                        <div className="p-6 border-b border-l border-orange-500/40 text-center bg-orange-500/[0.07]">
                            <div className="flex justify-center mb-2">
                                <span className="text-[9px] font-bold text-black bg-orange-500 px-2 py-1 rounded-full tracking-widest uppercase">
                                    Популярний
                                </span>
                            </div>
                            <p className="text-xs font-bold tracking-widest text-orange-400 uppercase mb-3">
                                Місячна
                            </p>
                            <div className="flex items-end justify-center gap-1">
                                <span className="font-black text-white text-[32px] leading-none">99</span>
                                <span className="text-white/50 text-xs mb-1">грн/міс</span>
                            </div>
                            <p className="text-white/35 text-[10px] line-through mt-0.5">200 грн</p>
                        </div>
                    </div>

                    {/* Рядки фіч */}
                    {features.map((row, i) => (
                        <div
                            key={row.label}
                            className={`grid grid-cols-[1fr_repeat(3,minmax(0,180px))] ${i % 2 === 0 ? "bg-white/[0.02]" : "bg-white/[0.04]"}`}
                        >
                            <div className="px-6 py-4 flex items-center border-b border-white/[0.06]">
                                <span className="text-sm text-white/70">{row.label}</span>
                            </div>
                            <div className="px-4 py-4 flex items-center justify-center border-b border-l border-white/[0.06]">
                                {row.free}
                            </div>
                            <div className="px-4 py-4 flex items-center justify-center border-b border-l border-white/[0.06]">
                                {row.weekly}
                            </div>
                            <div className="px-4 py-4 flex items-center justify-center border-b border-l border-orange-500/[0.12] bg-orange-500/[0.03]">
                                {row.premium}
                            </div>
                        </div>
                    ))}

                    {/* Кнопки */}
                    <div className="grid grid-cols-[1fr_repeat(3,minmax(0,180px))] bg-white/[0.03]">
                        <div className="p-6" />

                        {/* FREE кнопка */}
                        <div className="p-4 border-l border-white/[0.1]">
                            <a
                                href="https://t.me/FoxFlat_bot?start=website"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => handleBotClick("tier-free", "Безкоштовно")}
                                className="block text-center text-xs font-bold text-orange-400 border border-orange-500/50 px-3 py-3 rounded-xl hover:bg-orange-500/10 transition-all"
                            >
                                Спробувати
                            </a>
                        </div>

                        {/* WEEKLY кнопка */}
                        <div className="p-4 border-l border-white/[0.1]">
                            <button
                                disabled
                                className="w-full text-center text-xs font-bold text-white/30 border border-white/15 px-3 py-3 rounded-xl cursor-not-allowed"
                            >
                                Незабаром
                            </button>
                        </div>

                        {/* PREMIUM кнопка */}
                        <div className="p-4 border-l border-orange-500/30 bg-orange-500/[0.07]">
                            <a
                                href="https://t.me/FoxFlat_bot?start=website_premium"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => handleBotClick("tier-premium", "Місячна підписка")}
                                className="block text-center text-xs font-bold text-black bg-orange-500 hover:bg-transparent hover:text-orange-500 border-2 border-orange-500 px-3 py-3 rounded-xl transition-all"
                            >
                                Підключити
                            </a>
                        </div>
                    </div>
                </motion.div>

                <p className="text-center text-xs text-white/35 mt-6">
                    Підписка оформлюється безпосередньо в Telegram-боті
                </p>
            </div>
        </section>
    );
}