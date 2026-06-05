'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const IconBot = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="8" width="18" height="13" rx="3" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
        <circle cx="9" cy="14" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="15" cy="14" r="1.2" fill="currentColor" stroke="none" />
        <path d="M9 18h6" />
    </svg>
);

const IconFilter = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 5h18M6 10h12M9 15h6M11 20h2" />
    </svg>
);

const IconBell = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 10a6 6 0 0 1 12 0c0 4 2 6 2 6H4s2-2 2-6" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        <circle cx="18" cy="5" r="3" fill="#F97316" stroke="none" />
    </svg>
);

const IconHome = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9.5z" />
        <path d="M9 21V12h6v9" />
    </svg>
);

const steps = [
    {
        num: '01',
        Icon: IconBot,
        title: 'Запусти бота',
        desc: 'Реєстрація займає 10 секунд — ніяких паролів, форм і підтверджень email.',
        highlight: 'Старт за 10 сек',
        detail: 'Доступно на iOS, Android та десктопі',
    },
    {
        num: '02',
        Icon: IconFilter,
        title: 'Налаштуй фільтри',
        desc: "Обери місто, район, кількість кімнат і бюджет. Бот запам'ятає всі твої вподобання і застосує їх автоматично.",
        highlight: 'Гнучкі критерії',
        detail: '22 міста, необмежена кількість фільтрів у преміумі',
    },
    {
        num: '03',
        Icon: IconBell,
        title: 'Отримуй сповіщення',
        desc: 'Нові квартири надходять миттєво — ти серед перших, хто бачить нове оголошення. Моніторинг кожні 15 хвилин.',
        highlight: 'Моментально',
        detail: 'Без спаму — тільки релевантні оголошення',
    },
    {
        num: '04',
        Icon: IconHome,
        title: 'Знайди квартиру',
        desc: "Перейди за посиланням прямо до оголошення й зв'яжись з орендодавцем напряму.",
        highlight: 'Без переплат',
        detail: 'Прямий контакт з власником квартири',
    },
];

export default function HowItWorksFoxFlat() {
    const [activeStep, setActiveStep] = useState<number>(0);

    return (
        <section className="relative py-28 px-6 overflow-hidden">
            <div
                className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(249,115,22,0.05) 0%, transparent 65%)' }}
            />

            <div className="relative max-w-6xl mx-auto">
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center text-xs font-bold tracking-widest text-orange-500 uppercase mb-4"
                >
                    Як це працює
                </motion.p>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center font-black mb-4 leading-tight"
                    style={{
                        fontFamily: "'Unbounded', sans-serif",
                        fontSize: 'clamp(26px, 3.5vw, 42px)',
                        letterSpacing: '-1px',
                    }}
                >
                    Як знайти квартиру через Telegram: 4 прості кроки
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                    className="text-center text-white/40 text-base max-w-md mx-auto mb-20 leading-relaxed"
                >
                    Без реєстрацій, без дзвінків ріелторам — тільки свіжі оголошення в Telegram
                </motion.p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
                    <div className="relative">
                        <div className="absolute left-[27px] top-4 bottom-4 w-px bg-white/[0.06]" />
                        <motion.div
                            className="absolute left-[27px] top-4 w-px bg-gradient-to-b from-orange-500/70 to-orange-500/10"
                            initial={{ height: '0%' }}
                            whileInView={{ height: '100%' }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.4, ease: 'easeInOut', delay: 0.4 }}
                        />

                        <div className="flex flex-col gap-3">
                            {steps.map((step, i) => {
                                const isActive = activeStep === i;
                                return (
                                    <motion.div
                                        key={step.num}
                                        initial={{ opacity: 0, x: -24 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.45, delay: i * 0.1 + 0.3 }}
                                        onMouseEnter={() => setActiveStep(i)}
                                        className={`relative flex items-center gap-5 pl-16 pr-5 py-5 rounded-2xl cursor-pointer transition-all duration-300 ${
                                            isActive
                                                ? 'bg-white/[0.04] border border-orange-500/25'
                                                : 'border border-transparent hover:bg-white/[0.02]'
                                        }`}
                                    >
                                        <div className={`absolute left-[19px] w-[17px] h-[17px] rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 ${
                                            isActive
                                                ? 'border-orange-500 bg-orange-500/20 scale-125'
                                                : 'border-white/20 bg-black'
                                        }`}>
                                            {isActive && (
                                                <div className="w-[7px] h-[7px] rounded-full bg-orange-500" />
                                            )}
                                        </div>

                                        <div className={`flex-shrink-0 p-2.5 rounded-xl border transition-all duration-300 ${
                                            isActive
                                                ? 'bg-orange-500/15 border-orange-500/30 text-orange-400'
                                                : 'bg-white/[0.03] border-white/[0.07] text-white/30'
                                        }`}>
                                            <step.Icon />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-0.5">
                                                <span
                                                    className={`font-bold leading-snug transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/50'}`}
                                                    style={{ fontFamily: "'Unbounded', sans-serif", fontSize: '14px' }}
                                                >
                                                    {step.title}
                                                </span>
                                            </div>
                                            <span className={`text-xs transition-colors duration-300 ${isActive ? 'text-orange-400/80' : 'text-white/20'}`}>
                                                {step.highlight}
                                            </span>
                                        </div>

                                        <span
                                            className={`flex-shrink-0 text-sm font-bold transition-colors duration-300 ${isActive ? 'text-orange-500/50' : 'text-white/10'}`}
                                            style={{ fontFamily: "'Unbounded', sans-serif" }}
                                        >
                                            {step.num}
                                        </span>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="lg:sticky lg:top-32">
                        <AnimatePresence mode="wait">
                            {steps.map((step, i) =>
                                activeStep === i ? (
                                    <motion.div
                                        key={step.num}
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.35, ease: 'easeOut' }}
                                        className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.025] p-10"
                                    >
                                        <div
                                            className="absolute -top-4 -right-4 font-black text-white/[0.04] select-none pointer-events-none leading-none"
                                            style={{
                                                fontFamily: "'Unbounded', sans-serif",
                                                fontSize: '160px',
                                                letterSpacing: '-8px',
                                            }}
                                        >
                                            {step.num}
                                        </div>

                                        <div
                                            className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
                                            style={{ background: 'radial-gradient(circle at 80% 20%, rgba(249,115,22,0.07) 0%, transparent 60%)' }}
                                        />

                                        <div className="inline-flex p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 mb-8">
                                            <div style={{ transform: 'scale(1.4)', transformOrigin: 'center' }}>
                                                <step.Icon />
                                            </div>
                                        </div>

                                        <p className="text-xs font-bold tracking-widest text-orange-500 uppercase mb-3">
                                            Крок {step.num}
                                        </p>

                                        <h3
                                            className="font-black text-white mb-4 leading-tight"
                                            style={{
                                                fontFamily: "'Unbounded', sans-serif",
                                                fontSize: 'clamp(22px, 2.5vw, 30px)',
                                                letterSpacing: '-0.5px',
                                            }}
                                        >
                                            {step.title}
                                        </h3>

                                        <p className="text-white/50 leading-relaxed mb-8 text-[15px]">
                                            {step.desc}
                                        </p>

                                        <div className="flex items-center gap-3 pt-6 border-t border-white/[0.06]">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                                            <span className="text-sm text-white/35">{step.detail}</span>
                                        </div>

                                        <div className="flex gap-1.5 mt-6">
                                            {steps.map((_, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`h-[3px] rounded-full transition-all duration-300 ${
                                                        idx === i
                                                            ? 'bg-orange-500 w-8'
                                                            : idx < i
                                                                ? 'bg-orange-500/30 w-3'
                                                                : 'bg-white/10 w-3'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : null
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col items-center mt-16 gap-4"
                >
                    <a
                        href="https://t.me/FoxFlat_bot?start=website"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-orange-500 hover:bg-transparent text-black hover:text-orange-500 font-bold px-8 py-4 rounded-xl border-2 border-orange-500 transition-all duration-200"
                        style={{ fontFamily: "'Unbounded', sans-serif", fontSize: '13px' }}
                    >
                        <span>Спробувати зараз</span>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>

                    <Link
                        href="/tools/calculator"
                        className="text-xs text-white/50 hover:text-orange-500 transition-colors border-b border-white/20 hover:border-orange-500/50 pb-0.5"
                    >
                        Калькулятор витрат на оренду →
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}