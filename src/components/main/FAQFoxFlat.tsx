'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

type FAQItem = {
    q: string;
    a: string;
    type?: 'calculator';
    linkText?: string;
    href?: string;
};

const faqs: FAQItem[] = [
    {
        q: 'Скільки коштує використання FoxFlat?',
        a: 'Є безкоштовний тариф з базовим пошуком і обмеженнями. Преміум-доступ: 99 грн на 7 днів або 199 грн на місяць — в обох варіантах повний функціонал без обмежень.',
    },
    {
        q: 'Яка різниця між Free та Premium?',
        a: 'Free дає базовий пошук квартир з обмеженнями: сповіщення приходять кожні 30 хвилин, можна змінювати фільтри лише раз на добу і відкривати до 3 оголошень на день. Premium відкриває всі можливості: миттєві сповіщення, повний набір фільтрів (район, площа, поверх), необмежені зміни параметрів пошуку та необмежену кількість переходів на оголошення.',
    },
    {
        type: 'calculator',
        q: 'Як розрахувати бюджет на оренду?',
        a: 'Ми створили зручний калькулятор витрат, який допоможе тобі спланувати бюджет на оренду, враховуючи комунальні послуги, комісії та інші витрати.',
        linkText: 'Перейти до калькулятора →',
        href: '/tools/calculator',
    },
    {
        q: 'У яких містах працює бот?',
        a: 'FoxFlat працює у 22 містах України: Київ, Львів, Одеса, Харків, Дніпро, Запоріжжя, Вінниця, Миколаїв, Херсон, Чернігів, Полтава, Черкаси, Суми, Житомир, Рівне, Луцьк, Тернопіль, Хмельницький, Кропивницький, Ужгород, Івано-Франківськ та Чернівці.',
    },
    {
        q: 'Як швидко приходять нові оголошення?',
        a: 'FoxFlat перевіряє нові оголошення кожні 15 хвилин. У Premium користувачі отримують сповіщення практично миттєво (кожні кілька хвилин). У Free тарифі оголошення надсилаються підбіркою приблизно раз на 30 хвилин.',
    },
    {
        q: 'Чи можна налаштувати фільтри пошуку?',
        a: 'Так. Ти можеш фільтрувати оголошення за містом, ціною, кількістю кімнат та іншими параметрами. У Premium доступний повний набір фільтрів, включаючи район, площу, поверх та можливість використовувати кілька значень одночасно.',
    },
    {
        q: 'FoxFlat — це агентство нерухомості?',
        a: 'Ні. FoxFlat — це сервіс моніторингу оголошень. Ми збираємо публічні оголошення з популярних платформ і надсилаємо їх тобі.',
    },
    {
        q: 'Що робити, якщо бот не надсилає сповіщення?',
        a: 'Перевір налаштування фільтрів — можливо критерії занадто вузькі. Також переконайся, що бот не заблокований у Telegram. Якщо проблема не зникає — напиши нам у підтримку, і ми допоможемо.',
    },
];

function FaqItem({ item, index }: { item: FAQItem; index: number }) {
    const [open, setOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className={`border rounded-2xl overflow-hidden transition-all duration-300 shadow-sm ${
                open
                    ? 'border-[#FF6B35]/60 bg-white/[0.08] shadow-md'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
            }`}
        >
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
            >
                <span
                    className={`font-bold leading-snug transition-colors duration-200 ${
                        open ? 'text-[#FF6B35]' : 'text-white'
                    }`}
                    style={{
                        fontFamily: "'Unbounded', sans-serif",
                        fontSize: '13px',
                    }}
                >
                    {item.q}
                </span>

                <span
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold transition-all duration-300 ${
                        open
                            ? 'bg-[#FF6B35] text-white rotate-45'
                            : 'bg-white/10 text-white/50'
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
                        <div className="px-6 pb-6 text-sm text-white/70 leading-relaxed border-t border-white/5 pt-4">
                            <p>{item.a}</p>

                            {item.type === 'calculator' &&
                                item.href &&
                                item.linkText && (
                                    <Link
                                        href={item.href}
                                        className="inline-block mt-3 text-[#FF6B35] hover:text-[#e05a2b] font-semibold transition-colors underline decoration-[#FF6B35]/50 underline-offset-4"
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
        <section className="relative w-full bg-[#1E1E2E] text-white py-24 px-6 overflow-hidden">
            {/* М'яке фонове сяйво */}
            <div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none opacity-20"
                style={{
                    background:
                        'radial-gradient(circle, #FF6B35 0%, transparent 70%)',
                }}
            />

            <div className="relative max-w-3xl mx-auto">
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center text-xs font-extrabold tracking-widest text-[#FF6B35] uppercase mb-3"
                >
                    FAQ
                </motion.p>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center font-extrabold mb-12 leading-tight text-white"
                    style={{
                        fontFamily: "'Unbounded', sans-serif",
                        fontSize: 'clamp(24px, 3.5vw, 38px)',
                        letterSpacing: '-1px',
                    }}
                >
                    Часті запитання про оренду квартир через FoxFlat
                </motion.h2>

                <div className="flex flex-col gap-4">
                    {faqs.map((item, i) => (
                        <FaqItem key={i} item={item} index={i} />
                    ))}
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-center text-white/50 text-sm mt-12"
                >
                    Не знайшов відповідь?{' '}
                    <a
                        href="https://t.me/FoxFlatSupport"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FF6B35] font-semibold hover:underline underline-offset-4 transition-colors"
                    >
                        Напиши в підтримку
                    </a>
                </motion.p>
            </div>
        </section>
    );
}