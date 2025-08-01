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

export default function ClientContacts({ pageData }: ClientContactsProps) {
    return (
        <main className="relative w-full bg-black text-white overflow-hidden">
            <HeaderFoxFlat />

            {/* Hero section */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center justify-center text-center px-6 pt-32 pb-16 md:pt-40 md:pb-24"
            >
                <h1 className="text-4xl md:text-5xl font-bold text-orange-500 mb-6">
                    {pageData.title}
                </h1>
                <p className="text-lg md:text-xl max-w-2xl text-neutral-300">
                    {pageData.description}
                </p>
            </motion.section>

            {/* Contact section */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="max-w-3xl mx-auto px-6 py-20 text-center"
            >
                <h2 className="text-3xl font-bold text-orange-400 mb-10">Наші контакти</h2>
                <p className="text-lg text-neutral-200 mb-6">
                    Ми доступні у Telegram для підтримки, порад або просто фідбеку. Напишіть — ми поруч.
                </p>
                <a
                    href={pageData.telegramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-orange-500 hover:bg-orange-400 text-black font-bold text-sm px-8 py-3 rounded-full uppercase tracking-wide transition"
                >
                    Написати в Telegram
                </a>
            </motion.section>
        </main>
    );
}