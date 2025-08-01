'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function HeaderFoxFlat() {
    const pathname = usePathname();
    const isHome = pathname === '/';

    return (
        <header className="bg-black text-orange-500 border-b border-orange-600 relative z-10">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-center h-14">
                <div className="text-white font-bold text-lg tracking-widest select-none">
                    {isHome ? (
                        'FoxFlat'
                    ) : (
                        <Link href="/" className="hover:transition">
                            FoxFlat
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}