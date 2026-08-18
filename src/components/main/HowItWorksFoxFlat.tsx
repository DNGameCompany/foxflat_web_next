'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const IconBot = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="8" width="18" height="13" rx="3" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
        <circle cx="9" cy="14" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="15" cy="14" r="1.2" fill="currentColor" stroke="none" />
        <path d="M9 18h6" />
    </svg>
);

const IconFilter = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 5h18M6 10h12M9 15h6M11 20h2" />
    </svg>
);

const IconBell = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 10a6 6 0 0 1 12 0c0 4 2 6 2 6H4s2-2 2-6" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        <circle cx="18" cy="5" r="3" fill="#FF6B35" stroke="none" />
    </svg>
);

const IconHome = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9.5z" />
        <path d="M9 21V12h6v9" />
    </svg>
);

const steps = [
    {
        num: '01',
        Icon: IconBot,
        title: 'Обери місто',
        desc: 'Запусти бота і обери місто — і ти вже в системі. Моніторинг стартує миттєво, всі базові фільтри вже встановлено.',
        highlight: 'Старт за 10 сек',
        detail: 'Доступно на iOS, Android та десктопі',
    },
    {
        num: '02',
        Icon: IconFilter,
        title: 'Налаштуй фільтри',
        desc: "Обери район, площу, кількість кімнат, поверх і бюджет. Бот запам'ятає всі твої вподобання і застосує їх автоматично.",
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
        <section className="relative py-24 px-6 overflow-hidden bg-white text-[#1E1E2E]">
            {/* Фонове підсвічування */}
            <div
                className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(255,107,53,0.08) 0%, transparent 65%)' }}
            />

            <div className="relative max-w-6xl mx-auto">
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center text-xs font-extrabold tracking-widest text-[#FF6B35] uppercase mb-3"
                >
                    Як це працює
                </motion.p>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center font-extrabold mb-4 leading-tight text-[#1E1E2E]"
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
                    className="text-center text-[#1E1E2E]/60 text-base max-w-md mx-auto mb-16 leading-relaxed"
                >
                    Без реєстрацій, без дзвінків ріелторам — тільки свіжі оголошення в Telegram
                </motion.p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
                    {/* Список кроків */}
                    <div className="relative">
                        <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-[#1E1E2E]/10" />
                        <motion.div
                            className="absolute left-[27px] top-4 w-0.5 bg-[#FF6B35]"
                            initial={{ height: '0%' }}
                            whileInView={{ height: '100%' }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.4, ease: [0, 0, 0.2, 1], delay: 0.4 }}
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
                                                ? 'bg-[#1E1E2E] text-white shadow-xl scale-[1.02]'
                                                : 'border border-transparent hover:bg-[#1E1E2E]/5 text-[#1E1E2E]'
                                        }`}
                                    >
                                        <div className={`absolute left-[19px] w-[17px] h-[17px] rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 ${
                                            isActive
                                                ? 'border-[#FF6B35] bg-[#FF6B35] scale-125'
                                                : 'border-[#1E1E2E]/30 bg-white'
                                        }`}>
                                            {isActive && (
                                                <div className="w-[5px] h-[5px] rounded-full bg-white" />
                                            )}
                                        </div>

                                        <div className={`flex-shrink-0 p-2.5 rounded-xl border transition-all duration-300 ${
                                            isActive
                                                ? 'bg-[#FF6B35] border-[#FF6B35] text-white'
                                                : 'bg-[#1E1E2E]/5 border-[#1E1E2E]/10 text-[#1E1E2E]/60'
                                        }`}>
                                            <step.Icon />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-0.5">
                                                <span
                                                    className={`font-bold leading-snug transition-colors duration-300 ${isActive ? 'text-white' : 'text-[#1E1E2E]'}`}
                                                    style={{ fontFamily: "'Unbounded', sans-serif", fontSize: '14px' }}
                                                >
                                                    {step.title}
                                                </span>
                                            </div>
                                            <span className={`text-xs font-semibold transition-colors duration-300 ${isActive ? 'text-[#FF6B35]' : 'text-[#1E1E2E]/40'}`}>
                                                {step.highlight}
                                            </span>
                                        </div>

                                        <span
                                            className={`flex-shrink-0 text-sm font-extrabold transition-colors duration-300 ${isActive ? 'text-[#FF6B35]' : 'text-[#1E1E2E]/20'}`}
                                            style={{ fontFamily: "'Unbounded', sans-serif" }}
                                        >
                                            {step.num}
                                        </span>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Картка деталей кроку */}
                    <div className="lg:sticky lg:top-32">
                        <AnimatePresence mode="wait">
                            {steps.map((step, i) =>
                                activeStep === i ? (
                                    <motion.div
                                        key={step.num}
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.35, ease: [0, 0, 0.2, 1] }}
                                        className="relative overflow-hidden rounded-3xl border border-[#1E1E2E]/10 bg-[#1E1E2E] text-white p-10 shadow-2xl"
                                    >
                                        <div
                                            className="absolute -top-4 -right-4 font-black text-white/5 select-none pointer-events-none leading-none"
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
                                            style={{ background: 'radial-gradient(circle at 80% 20%, rgba(255,107,53,0.15) 0%, transparent 60%)' }}
                                        />

                                        <div className="inline-flex p-4 rounded-2xl bg-[#FF6B35]/15 border border-[#FF6B35]/20 text-[#FF6B35] mb-8">
                                            <div style={{ transform: 'scale(1.4)', transformOrigin: 'center' }}>
                                                <step.Icon />
                                            </div>
                                        </div>

                                        <p className="text-xs font-bold tracking-widest text-[#FF6B35] uppercase mb-3">
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

                                        <p className="text-white/70 leading-relaxed mb-8 text-[15px]">
                                            {step.desc}
                                        </p>

                                        <div className="flex items-center gap-3 pt-6 border-t border-white/10">
                                            <div className="w-2 h-2 rounded-full bg-[#FF6B35] flex-shrink-0" />
                                            <span className="text-sm font-medium text-white/60">{step.detail}</span>
                                        </div>

                                        <div className="flex gap-1.5 mt-6">
                                            {steps.map((_, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`h-[3px] rounded-full transition-all duration-300 ${
                                                        idx === i
                                                            ? 'bg-[#FF6B35] w-8'
                                                            : idx < i
                                                                ? 'bg-[#FF6B35]/40 w-3'
                                                                : 'bg-white/20 w-3'
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

                {/* Заклик до дії */}
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
                        className="inline-flex items-center gap-3 bg-[#FF6B35] hover:bg-[#e05a2b] text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
                        style={{ fontFamily: "'Unbounded', sans-serif", fontSize: '13px' }}
                    >
                        <span>Спробувати зараз</span>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>

                    <Link
                        href="/tools/calculator"
                        className="text-xs text-[#1E1E2E]/60 hover:text-[#FF6B35] transition-colors border-b border-[#1E1E2E]/20 hover:border-[#FF6B35] pb-0.5 font-semibold"
                    >
                        Калькулятор витрат на оренду →
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}