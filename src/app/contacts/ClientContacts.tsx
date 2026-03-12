'use client';

import { motion } from 'framer-motion';
import HeaderFoxFlat from '@/src/components/HeaderFoxFlat';

interface PageData {
    title: string;
    description: string;
    telegramLink: string;
}

interface ClientContactsProps {
    pageData: PageData;
}

const contacts = [
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
        ),
        label: 'Telegram підтримка',
        value: '@foxflat_support',
        href: 'https://t.me/qa_aqa_dmytro',
        desc: 'Відповідаємо протягом кількох годин',
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        ),
        label: 'Telegram бот',
        value: '@FoxFlat_bot',
        href: 'https://t.me/FoxFlat_bot?start=website',
        desc: 'Запусти бота і знаходь квартири',
    },
];

export default function ClientContacts({ pageData }: ClientContactsProps) {
    return (
        <main className="relative w-full bg-black text-white overflow-hidden">
            <HeaderFoxFlat />

            {/* bg glow */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(249,115,22,0.07) 0%, transparent 65%)' }}
            />

            {/* Hero */}
            <section className="relative pt-36 pb-20 px-6 text-center">
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs font-bold tracking-widest text-orange-500 uppercase mb-4"
                >
                    Зв&#39;язок з нами
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="font-black leading-tight mb-5 mx-auto"
                    style={{
                        fontFamily: "'Unbounded', sans-serif",
                        fontSize: 'clamp(28px, 4vw, 52px)',
                        letterSpacing: '-1.5px',
                        maxWidth: '700px',
                    }}
                >
                    {pageData.title}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="text-white/40 text-base leading-relaxed max-w-md mx-auto"
                >
                    {pageData.description}
                </motion.p>
            </section>

            {/* Контакти */}
            <section className="relative px-6 pb-32 max-w-3xl mx-auto">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
                    {contacts.map((c, i) => (
                        <motion.a
                            key={i}
                            href={c.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: i * 0.1 }}
                            className="group relative flex flex-col gap-4 p-7 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:border-orange-500/30 hover:bg-white/[0.04] transition-all duration-300 overflow-hidden"
                        >
                            {/* top line on hover */}
                            <div className="absolute top-0 left-0 right-0 h-px bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                            {/* glow */}
                            <div
                                className="absolute top-0 right-0 w-32 h-32 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{ background: 'radial-gradient(circle at 100% 0%, rgba(249,115,22,0.08) 0%, transparent 70%)' }}
                            />

                            <div className="inline-flex p-3 rounded-xl bg-orange-500/10 border border-orange-500/15 text-orange-400 self-start group-hover:bg-orange-500/15 transition-colors duration-300">
                                {c.icon}
                            </div>

                            <div>
                                <p className="text-[10px] font-bold tracking-widest text-white/25 uppercase mb-1"
                                   style={{ fontFamily: "'Unbounded', sans-serif" }}>
                                    {c.label}
                                </p>
                                <p className="font-bold text-white text-base mb-1"
                                   style={{ fontFamily: "'Unbounded', sans-serif", fontSize: '15px' }}>
                                    {c.value}
                                </p>
                                <p className="text-xs text-white/30">{c.desc}</p>
                            </div>

                            <div className="mt-auto flex items-center gap-1.5 text-orange-500/60 group-hover:text-orange-400 transition-colors duration-200">
                                <span className="text-xs font-semibold">Написати</span>
                                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </motion.a>
                    ))}
                </div>

                {/* Розділювач + CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="relative p-8 rounded-2xl border border-white/[0.07] bg-white/[0.02] text-center overflow-hidden"
                >
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(249,115,22,0.06) 0%, transparent 65%)' }}
                    />
                    <p
                        className="font-black text-white mb-2 relative z-10"
                        style={{ fontFamily: "'Unbounded', sans-serif", fontSize: '18px', letterSpacing: '-0.5px' }}
                    >
                        Готовий спробувати FoxFlat?
                    </p>
                    <p className="text-sm text-white/35 mb-7 relative z-10">
                        Запусти бота і отримуй нові квартири першим
                    </p>
                    <a
                        href={pageData.telegramLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative z-10 inline-flex items-center gap-3 bg-orange-500 hover:bg-transparent hover:text-orange-500 text-black font-bold border-2 border-orange-500 px-8 py-4 rounded-xl transition-all duration-200"
                        style={{ fontFamily: "'Unbounded', sans-serif", fontSize: '12px' }}
                    >
                        Написати в Telegram
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>
                </motion.div>
            </section>
        </main>
    );
}