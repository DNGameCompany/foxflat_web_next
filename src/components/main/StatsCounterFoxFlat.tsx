'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
    {
        value: 2400,
        suffix: '+',
        label: 'активних користувачів',
        max: 3000,
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="7" r="4" />
                <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                <path d="M21 21v-2a4 4 0 0 0-3-3.87" />
            </svg>
        ),
    },
    {
        value: 22,
        suffix: '',
        label: 'міста України',
        max: 25,
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z" />
                <circle cx="12" cy="9" r="2.5" />
            </svg>
        ),
    },
    {
        value: 180,
        suffix: '+',
        label: 'нових квартир щодня',
        max: 250,
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9.5z" />
                <path d="M9 21V12h6v9" />
            </svg>
        ),
    },
    {
        value: 15,
        prefix: '<',
        suffix: ' хв',
        label: 'до першого сповіщення',
        max: 60,
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
            </svg>
        ),
    },
];

// КЛЮЧОВА ЗМІНА: стартуємо з target, а не з 0.
// SSR/перший рендер завжди покаже фінальне число — Google і будь-який
// бот без JS бачитимуть коректні цифри одразу в HTML.
// Анімація "від 0" — це лише косметичний ефект, що відбувається ПІСЛЯ
// гідратації, і тільки якщо елемент потрапив у viewport.
function useCountUp(target: number, duration = 1800, started: boolean) {
    const [count, setCount] = useState(target);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!started || hasAnimated.current) return;
        hasAnimated.current = true;

        // Косметичний "розбіг" від 0 — тільки в браузері, тільки один раз.
        setCount(0);
        let startTime: number | null = null;

        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;

            const progress = Math.min((timestamp - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);

            setCount(Math.floor(ease * target));

            if (progress < 1) requestAnimationFrame(step);
            else setCount(target); // гарантуємо точне фінальне значення
        };

        requestAnimationFrame(step);
    }, [target, duration, started]);

    return count;
}

function StatCard({ item, index, started }: { item: typeof stats[0]; index: number; started: boolean }) {
    const count = useCountUp(item.value, 1600 + index * 120, started);
    const progressPct = Math.min((item.value / item.max) * 100, 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative flex flex-col p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:border-orange-500/30 hover:bg-white/[0.04] transition-all duration-300 overflow-hidden"
        >
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: 'radial-gradient(circle at 0% 100%, rgba(249,115,22,0.07) 0%, transparent 65%)' }}
            />

            <div className="inline-flex p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/15 text-orange-400 mb-5 self-start group-hover:bg-orange-500/15 transition-colors duration-300">
                {item.icon}
            </div>

            <div className="flex items-end gap-0.5 mb-1">

                {item.prefix && (
                    <span
                        className="font-black text-orange-500 mb-1"
                        style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 'clamp(20px, 2.5vw, 28px)', letterSpacing: '-1px' }}
                    >
                        {item.prefix}
                    </span>
                )}

                <span
                    className="font-black leading-none text-white"
                    style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 'clamp(36px, 4vw, 48px)', letterSpacing: '-2px' }}
                >
                    {count.toLocaleString('uk-UA')}
                </span>

                <span
                    className="font-black text-orange-500 mb-1"
                    style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 'clamp(20px, 2.5vw, 28px)', letterSpacing: '-1px' }}
                >
                    {item.suffix}
                </span>

            </div>

            <p className="text-xs text-white/40 font-medium mb-5 leading-snug">
                {item.label}
            </p>

            <div className="mt-auto">
                <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] text-white/20 font-medium">0</span>
                    <span className="text-[10px] text-white/20 font-medium">
                        {item.max.toLocaleString('uk-UA')}{item.suffix}
                    </span>
                </div>

                <div className="h-[3px] w-full rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, #F97316, #FBBF24)' }}
                        initial={{ width: '0%' }}
                        animate={started ? { width: `${progressPct}%` } : { width: '0%' }}
                        transition={{ duration: 1.4, ease: 'easeOut', delay: index * 0.1 + 0.3 }}
                    />
                </div>
            </div>
        </motion.div>
    );
}

export default function StatsCounterFoxFlat() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section ref={ref} className="relative py-20 px-6 overflow-hidden">

            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 pointer-events-none"
                style={{ background: 'linear-gradient(to bottom, transparent, rgba(249,115,22,0.3))' }}
            />

            <div className="relative max-w-5xl mx-auto">

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center text-xs font-bold tracking-widest text-orange-500 uppercase mb-12"
                >
                    FoxFlat у цифрах
                </motion.p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {stats.map((item, i) => (
                        <StatCard key={i} item={item} index={i} started={isInView} />
                    ))}
                </div>

            </div>
        </section>
    );
}