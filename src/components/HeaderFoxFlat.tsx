'use client';

import React, { useState, useEffect } from 'react';
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
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Закрити мобільне меню при переході на іншу сторінку
    useEffect(() => { setOpen(false); }, [pathname]);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled || open
                    ? 'bg-black/80 backdrop-blur-md border-b border-white/[0.06]'
                    : 'bg-transparent border-b border-transparent'
            }`}
        >
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

                {/* Навігація — десктоп */}
                <nav className="hidden md:flex items-center gap-6">
                    {NAV_LINKS.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`text-xs font-semibold transition-colors ${
                                pathname === href
                                    ? 'text-orange-400'
                                    : 'text-white/50 hover:text-white'
                            }`}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                {/* CTA — десктоп */}
                <a
                    href="https://t.me/FoxFlat_bot?start=website_header"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden md:inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs px-4 py-2 rounded-lg transition-colors"
                >
                    Запустити бота
                </a>

                {/* Гамбургер — мобільний */}
                <button
                    onClick={() => setOpen((v) => !v)}
                    className="md:hidden flex flex-col justify-center items-center gap-[5px] w-8 h-8"
                    aria-label="Меню"
                >
                    <span className={`block h-0.5 w-5 bg-white transition-all duration-200 ${open ? 'rotate-45 translate-y-[7px]' : ''}`} />
                    <span className={`block h-0.5 w-5 bg-white transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
                    <span className={`block h-0.5 w-5 bg-white transition-all duration-200 ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} />
                </button>
            </div>

            {/* Мобільне меню */}
            {open && (
                <div className="md:hidden border-t border-white/[0.06] bg-black/90 backdrop-blur-md px-6 py-4 flex flex-col gap-1">
                    {NAV_LINKS.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setOpen(false)}
                            className={`py-3 text-sm font-semibold border-b border-white/[0.05] transition-colors ${
                                pathname === href
                                    ? 'text-orange-400'
                                    : 'text-white/60 hover:text-white'
                            }`}
                        >
                            {label}
                        </Link>
                    ))}
                    <a
                        href="https://t.me/FoxFlat_bot?start=website_header"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setOpen(false)}
                        className="mt-3 inline-flex justify-center items-center gap-2 bg-orange-500 hover:bg-orange-400 text-black font-bold text-sm px-4 py-3 rounded-lg transition-colors"
                    >
                        Запустити бота
                    </a>
                </div>
            )}
        </header>
    );
}
