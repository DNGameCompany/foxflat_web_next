'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
    { href: '/blog',     label: 'Блог' },
    { href: '/reviews',  label: 'Відгуки' },
    { href: '/contacts', label: 'Контакти' },
];

export default function HeaderFoxFlat() {
    const pathname = usePathname();
    const isHome = pathname === '/';

    return (
        <header className="bg-black border-b border-white/[0.06] relative z-10">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-14">

                {/* Логотип */}
                <div className="text-white font-bold text-lg tracking-widest select-none">
                    {isHome ? (
                        'FoxFlat'
                    ) : (
                        <Link href="/" className="hover:text-orange-400 transition-colors">
                            FoxFlat
                        </Link>
                    )}
                </div>

                {/* Навігація */}
                <nav className="hidden md:flex items-center gap-6">
                    {NAV_LINKS.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`text-xs font-semibold transition-colors ${
                                pathname === href
                                    ? 'text-orange-400'
                                    : 'text-white/40 hover:text-white'
                            }`}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                {/* CTA */}
                <a
                    href="https://t.me/FoxFlat_bot?start=website_header"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs px-4 py-2 rounded-lg transition-colors"
                >
                    Запустити бота
                </a>

            </div>
        </header>
    );
}