'use client';

import { motion } from 'framer-motion';
import HeaderFoxFlat from '@/src/components/HeaderFoxFlat';
import Image from "next/image";

interface PageData {
    title: string;
    description: string;
    telegramLink: string;
    imageSrc: string;
    imageAlt: string;
}

interface ClientThankYouProps {
    pageData: PageData;
}

export default function ClientThankYou({ pageData }: ClientThankYouProps) {
    return (
        <main className="relative w-full overflow-hidden bg-black text-white flex items-center justify-center text-center px-6">
            <HeaderFoxFlat />
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white/10 backdrop-blur-md p-10 rounded-2xl shadow-2xl max-w-md w-full z-10"
            >
                <Image
                    src={pageData.imageSrc}
                    alt={pageData.imageAlt}
                    className="mx-auto w-24 h-24 mb-6"
                    fill
                    style={{ objectFit: "contain" }}
                />
                <h1 className="text-3xl font-bold text-orange-400 mb-4">
                    ✅ {pageData.title}
                </h1>
                <p className="text-lg text-neutral-200 mb-6">
                    {pageData.description}
                </p>
                <a
                    href={pageData.telegramLink}
                    className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-full transition duration-300"
                >
                    Повернутись до бота
                </a>
            </motion.div>
        </main>
    );
}