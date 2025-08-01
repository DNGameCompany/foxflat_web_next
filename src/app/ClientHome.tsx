'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import HeaderFoxFlat from '@/src/components/HeaderFoxFlat';
import AnimatedBackground from '@/src/components/AnimatedBackground';
import HeroFoxFlat from '@/src/components/main/HeroFoxFlat';
import FeatureFoxFlat from '@/src/components/main/FeatureFoxFlat';
import PricingFoxFlat from '@/src/components/main/PricingFoxFlat';
import CtaFoxFlat from '@/src/components/main/CtaFoxFlat';

interface PageData {
    title: string;
    description: string;
    advantages: string[];
}

interface ClientHomeProps {
    pageData: PageData;
}

export default function ClientHome({ pageData }: ClientHomeProps) {
    const [showScrollHint, setShowScrollHint] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setShowScrollHint(false);
            } else {
                setShowScrollHint(true);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <main className="relative min-h-screen w-full overflow-hidden bg-black">
            <AnimatedBackground color="rgba(0,255,170,0.6)" />
            <HeaderFoxFlat />
            <HeroFoxFlat />

            {showScrollHint && (
                <span className="fixed bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-orange-400 z-10 text-3xl pointer-events-none select-none">
          ↓
        </span>
            )}

            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
                <FeatureFoxFlat />
            </motion.section>

            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
                <PricingFoxFlat />
            </motion.section>

            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
                <CtaFoxFlat />
            </motion.section>

            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative z-10 max-w-6xl mx-auto px-6 py-16"
            >
                <h2 className="text-3xl md:text-4xl font-bold text-center text-lime-400 mb-12">
                    Миттєві переваги FoxFlat
                </h2>
                <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
                    {pageData.advantages.map((text, idx) => (
                        <div
                            key={idx}
                            className="bg-neutral-900/80 rounded-xl p-4 break-inside-avoid border border-neutral-700 hover:border-lime-400 transition"
                        >
                            <p className="text-neutral-200 text-base">{text}</p>
                        </div>
                    ))}
                </div>
            </motion.section>
        </main>
    );
}