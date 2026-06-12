'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
    { href: '/blog',     label: 'Блог' },
    { href: '/reviews',  label: 'Відгуки' },
    { href: '/contacts', label: 'Контакти' },
];

const TOOLS_LINKS = [
    { href: '/tools/calculator', label: 'Калькулятор оренди' },
    { href: '/tools/checklist',  label: 'Чек лист огляду' },
];

export default function HeaderFoxFlat() {
    const pathname = usePathname();
    const isHome = pathname === '/';
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [toolsOpen, setToolsOpen] = useState(false);
    const [toolsMobileOpen, setToolsMobileOpen] = useState(false);
    const toolsRef = useRef<HTMLDivElement>(null);

    const isToolsActive = TOOLS_LINKS.some(({ href }) => pathname === href);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Закрити мобільне меню при переході на іншу сторінку
    useEffect(() => { setOpen(false); setToolsMobileOpen(false); }, [pathname]);

    // Закрити dropdown при кліку поза ним
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
                setToolsOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

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

                    {/* Dropdown Інструменти */}
                    <div ref={toolsRef} className="relative">
                        <button
                            onClick={() => setToolsOpen((v) => !v)}
                            className={`flex items-center gap-1 text-xs font-semibold transition-colors ${
                                isToolsActive ? 'text-orange-400' : 'text-white/50 hover:text-white'
                            }`}
                        >
                            Інструменти
                            <svg
                                width="12" height="12" viewBox="0 0 12 12" fill="none"
                                className={`transition-transform duration-200 ${toolsOpen ? 'rotate-180' : ''}`}
                            >
                                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>

                        {toolsOpen && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-48 rounded-xl border border-white/[0.08] bg-black/90 backdrop-blur-md shadow-xl overflow-hidden">
                                <div className="p-1">
                                    {TOOLS_LINKS.map(({ href, label }) => (
                                        <Link
                                            key={href}
                                            href={href}
                                            onClick={() => setToolsOpen(false)}
                                            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                                                pathname === href
                                                    ? 'text-orange-400 bg-orange-500/10'
                                                    : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
                                            }`}
                                        >
                                            {pathname === href && (
                                                <span className="w-1 h-1 rounded-full bg-orange-400 flex-shrink-0" />
                                            )}
                                            {label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
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

                    {/* Інструменти — акордеон у мобільному */}
                    <div className="border-b border-white/[0.05]">
                        <button
                            onClick={() => setToolsMobileOpen((v) => !v)}
                            className={`w-full flex items-center justify-between py-3 text-sm font-semibold transition-colors ${
                                isToolsActive ? 'text-orange-400' : 'text-white/60'
                            }`}
                        >
                            Інструменти
                            <svg
                                width="14" height="14" viewBox="0 0 12 12" fill="none"
                                className={`transition-transform duration-200 ${toolsMobileOpen ? 'rotate-180' : ''}`}
                            >
                                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>

                        {toolsMobileOpen && (
                            <div className="pb-2 flex flex-col gap-0.5">
                                {TOOLS_LINKS.map(({ href, label }) => (
                                    <Link
                                        key={href}
                                        href={href}
                                        onClick={() => setOpen(false)}
                                        className={`pl-4 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                                            pathname === href
                                                ? 'text-orange-400'
                                                : 'text-white/50 hover:text-white'
                                        }`}
                                    >
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

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