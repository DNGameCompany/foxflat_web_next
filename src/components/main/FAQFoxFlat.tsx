'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { faqs, type FAQItem } from './faqData';

function FaqItem({ item, index }: { item: FAQItem; index: number }) {
    const [open, setOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.07 }}
            className={`border rounded-xl overflow-hidden transition-colors duration-200 ${
                open
                    ? 'border-orange-500/30 bg-orange-500/[0.04]'
                    : 'border-white/[0.06] bg-white/[0.02] hover:border-white/10'
            }`}
        >
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
            >
                <span
                    className={`text-sm font-semibold leading-snug transition-colors ${
                        open ? 'text-orange-400' : 'text-white'
                    }`}
                    style={{
                        fontFamily: "'Unbounded', sans-serif",
                        fontSize: '13px',
                    }}
                >
                    {item.q}
                </span>

                <span
                    className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        open
                            ? 'bg-orange-500 text-black rotate-45'
                            : 'bg-white/[0.06] text-white/40'
                    }`}
                >
                    +
                </span>
            </button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                            duration: 0.3,
                            ease: [0.4, 0, 0.2, 1],
                        }}
                    >
                        <div className="px-6 pb-5 text-sm text-white/50 leading-relaxed">
                            <p>{item.a}</p>

                            {item.type === 'calculator' &&
                                item.href &&
                                item.linkText && (
                                    <Link
                                        href={item.href}
                                        className="inline-block mt-3 text-orange-400 hover:text-white transition-colors underline decoration-orange-500/50 underline-offset-4"
                                    >
                                        {item.linkText}
                                    </Link>
                                )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function FaqFoxFlat() {
    return (
        <section className="relative py-24 px-4">
            <div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none opacity-[0.06]"
                style={{
                    background:
                        'radial-gradient(circle, #F97316 0%, transparent 70%)',
                }}
            />

            <div className="relative max-w-3xl mx-auto">
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center text-xs font-bold tracking-widest text-orange-500 uppercase mb-4"
                >
                    FAQ
                </motion.p>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center font-black mb-4 leading-tight"
                    style={{
                        fontFamily: "'Unbounded', sans-serif",
                        fontSize: 'clamp(24px, 3vw, 38px)',
                        letterSpacing: '-1px',
                    }}
                >
                    Часті запитання про FoxFlat
                </motion.h2>

                <div className="flex flex-col gap-3">
                    {faqs.map((item, i) => (
                        <FaqItem key={i} item={item} index={i} />
                    ))}
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="text-center text-white/30 text-sm mt-10"
                >
                    Не знайшов відповідь?{' '}
                    <a
                        href="https://t.me/FoxFlatSupport"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors"
                    >
                        Напиши в підтримку
                    </a>
                </motion.p>
            </div>
        </section>
    );
}