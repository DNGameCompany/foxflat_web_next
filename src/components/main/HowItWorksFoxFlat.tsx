'use client';

import { motion } from 'framer-motion';

const steps = [
    {
        num: '01',
        icon: '🤖',
        title: 'Запусти бота',
        desc: 'Натисни /start у FoxFlat Telegram-боті. Реєстрація займає 10 секунд — ніяких паролів і форм.',
        highlight: 'Старт за 10 сек',
    },
    {
        num: '02',
        icon: '🎯',
        title: 'Налаштуй фільтри',
        desc: 'Обери місто, район, кількість кімнат і бюджет. Бот запам\'ятає твої вподобання.',
        highlight: 'Гнучкі критерії',
    },
    {
        num: '03',
        icon: '🔔',
        title: 'Отримуй сповіщення',
        desc: 'Нові квартири надходять миттєво — ти серед перших, хто бачить нове оголошення.',
        highlight: 'Моментально',
    },
    {
        num: '04',
        icon: '🏠',
        title: 'Знайди квартиру',
        desc: 'Перейди за посиланням прямо до оголошення й зв\'яжись з орендодавцем без посередників.',
        highlight: 'Без переплат',
    },
];

export default function HowItWorksFoxFlat() {
    return (
        <section className="relative py-24 px-4 overflow-hidden">
            {/* bg grid */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(249,115,22,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.5) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }}
            />

            <div className="relative max-w-5xl mx-auto">
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
                    Квартира за 4 прості кроки
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                    className="text-center text-white/40 text-base max-w-md mx-auto mb-16 leading-relaxed"
                >
                    Без реєстрації на сайтах, без дзвінків ріелторам — тільки свіжі оголошення в Telegram
                </motion.p>

                {/* Steps */}
                <div className="relative">
                    {/* connector line desktop */}
                    <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px"
                         style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.25), rgba(249,115,22,0.25), transparent)' }} />

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.12 }}
                                className="group relative flex flex-col items-start p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-orange-500/30 hover:bg-white/[0.04] transition-all duration-300"
                            >
                                {/* step number */}
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center mb-5 text-sm font-bold border border-orange-500/30 bg-orange-500/10 text-orange-400 relative z-10"
                                    style={{ fontFamily: "'Unbounded', sans-serif" }}
                                >
                                    {step.num}
                                </div>

                                <span className="text-2xl mb-3">{step.icon}</span>

                                <h3
                                    className="font-bold text-white mb-2 text-base leading-tight"
                                    style={{ fontFamily: "'Unbounded', sans-serif", fontSize: '14px' }}
                                >
                                    {step.title}
                                </h3>

                                <p className="text-sm text-white/40 leading-relaxed mb-4 flex-1">
                                    {step.desc}
                                </p>

                                {/* pill */}
                                <span className="text-[11px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full">
                                    {step.highlight}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-center mt-12"
                >
                    <a
                        href="https://t.me/foxflat_bot?start=website"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-black font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/25"
                        style={{ fontFamily: "'Unbounded', sans-serif", fontSize: '13px' }}
                    >
                        <span>Спробувати зараз</span>
                        <span>→</span>
                    </a>
                </motion.div>
            </div>
        </section>
    );
}