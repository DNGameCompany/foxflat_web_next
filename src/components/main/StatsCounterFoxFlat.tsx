'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface StatItem {
    value: number;
    suffix: string;
    label: string;
    icon: string;
}

const stats: StatItem[] = [
    { value: 2400, suffix: '+', label: 'активних користувачів', icon: '👥' },
    { value: 22, suffix: '', label: 'міста України', icon: '🏙️' },
    { value: 180, suffix: '+', label: 'нових квартир щодня', icon: '🏠' },
    { value: 5, suffix: ' хв', label: 'до першого сповіщення', icon: '⚡' },
];

function useCountUp(target: number, duration = 1800, started: boolean) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!started) return;
        let startTime: number | null = null;
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // easeOutCubic
            const ease = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(ease * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [target, duration, started]);

    return count;
}

function StatCard({ item, index, started }: { item: StatItem; index: number; started: boolean }) {
    const count = useCountUp(item.value, 1600 + index * 100, started);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="relative flex flex-col items-center justify-center p-8 border border-white/[0.06] bg-white/[0.02] rounded-2xl overflow-hidden group hover:border-orange-500/30 transition-colors duration-300"
        >
            {/* glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                 style={{ background: 'radial-gradient(circle at 50% 50%, rgba(249,115,22,0.06) 0%, transparent 70%)' }} />

            <span className="text-3xl mb-3">{item.icon}</span>

            <div className="flex items-end gap-1 mb-1">
                <span
                    className="font-black leading-none text-orange-400"
                    style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 'clamp(32px, 4vw, 48px)' }}
                >
                    {count.toLocaleString('uk-UA')}
                </span>
                <span
                    className="text-orange-400 font-bold mb-1 text-2xl"
                    style={{ fontFamily: "'Unbounded', sans-serif" }}
                >
                    {item.suffix}
                </span>
            </div>

            <p className="text-sm text-white/40 font-medium text-center">{item.label}</p>
        </motion.div>
    );
}

export default function StatsCounterFoxFlat() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section ref={ref} className="relative py-16 px-4">
            {/* top divider line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent to-orange-500/30" />

            <div className="max-w-5xl mx-auto">
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center text-xs font-bold tracking-widest text-orange-500 uppercase mb-10"
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