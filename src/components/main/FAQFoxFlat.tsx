'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    {
        q: 'Скільки коштує використання FoxFlat?',
        a: 'Зараз преміум-доступ тимчасово безкоштовний для нових користувачів. Стандартна ціна сервісу — 200 грн на місяць. У безкоштовному тарифі доступний базовий пошук квартир з обмеженнями.',
    },
    {
        q: 'Яка різниця між Free та Premium?',
        a: 'Free дає базовий пошук квартир з обмеженнями: сповіщення приходять кожні 30 хвилин, можна змінювати фільтри лише раз на добу і відкривати до 3 оголошень на день. Premium відкриває всі можливості: миттєві сповіщення, повний набір фільтрів (район, площа, поверх), необмежені зміни параметрів пошуку та необмежену кількість переходів на оголошення.',
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

function FaqItem({ item, index }: { item: typeof faqs[0]; index: number }) {
    const [open, setOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.07 }}
            className={`border rounded-xl overflow-hidden transition-colors duration-200 ${open ? 'border-orange-500/30 bg-orange-500/[0.04]' : 'border-white/[0.06] bg-white/[0.02] hover:border-white/10'}`}
        >
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
            >
                <span
                    className={`text-sm font-semibold leading-snug transition-colors ${open ? 'text-orange-400' : 'text-white'}`}
                    style={{ fontFamily: "'Unbounded', sans-serif", fontSize: '13px' }}
                >
                    {item.q}
                </span>
                <span
                    className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${open ? 'bg-orange-500 text-black rotate-45' : 'bg-white/[0.06] text-white/40'}`}
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
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <p className="px-6 pb-5 text-sm text-white/50 leading-relaxed">
                            {item.a}
                        </p>
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
                style={{ background: 'radial-gradient(circle, #F97316 0%, transparent 70%)' }}
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
                    Часті запитання про оренду квартир через FoxFlat
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                    className="text-center text-white/40 text-sm max-w-md mx-auto mb-12 leading-relaxed"
                >
                    Є питання? Ми зібрали найпопулярніші відповіді
                </motion.p>

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
                        href="https://t.me/qa_aqa_dmytro"
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