'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import HeaderFoxFlat from '@/src/components/HeaderFoxFlat';
import AnimatedBackground from '@/src/components/AnimatedBackground';
import HeroFoxFlat from '@/src/components/main/HeroFoxFlat';
import FeatureFoxFlat from '@/src/components/main/FeatureFoxFlat';
import PricingFoxFlat from '@/src/components/main/PricingFoxFlat';
import CtaFoxFlat from '@/src/components/main/CtaFoxFlat';


export default function ClientHome() {
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
            <AnimatedBackground />
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
        </main>
    );
}