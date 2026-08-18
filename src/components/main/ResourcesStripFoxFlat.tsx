'use client';

import Link from 'next/link';
import { Calculator, ClipboardCheck, FileText, ArrowRight } from 'lucide-react';
import { ReactNode } from 'react';

interface ResourceItem {
    icon: ReactNode;
    title: string;
    description: string;
    href: string;
    cta: string;
}

const resources: ResourceItem[] = [
    {
        icon: <Calculator className="w-6 h-6" />,
        title: 'Калькулятор реальної вартості',
        description: 'Порахуй повну вартість оренди з урахуванням комісій і депозиту',
        href: '/tools/calculator',
        cta: 'Порахувати',
    },
    {
        icon: <ClipboardCheck className="w-6 h-6" />,
        title: 'Чек-лист огляду квартири',
        description: 'На що звернути увагу перед підписанням договору',
        href: '/tools/checklist',
        cta: 'Відкрити чек-лист',
    },
    {
        icon: <FileText className="w-6 h-6" />,
        title: 'Договір оренди — шаблон',
        description: 'Безкоштовний шаблон договору оренди квартири за ЦКУ',
        href: '/docs/dogovir-orendy',
        cta: 'Завантажити PDF',
    },
];

export default function ResourcesStripFoxFlat() {
    return (
        <section className="relative w-full bg-[#1E1E2E] text-white py-24 px-6 overflow-hidden">
            {/* Фонове сяйво */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
                style={{ background: "radial-gradient(ellipse, rgba(255,107,53,0.08) 0%, transparent 65%)" }}
            />

            <div className="relative max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-xs font-extrabold tracking-widest text-[#FF6B35] uppercase mb-3">
                        Інструменти
                    </p>
                    <h2
                        className="font-extrabold mb-4 leading-tight text-white"
                        style={{
                            fontFamily: "'Unbounded', sans-serif",
                            fontSize: "clamp(24px, 3.5vw, 40px)",
                            letterSpacing: "-1px",
                        }}
                    >
                        Корисно при оренді
                    </h2>
                    <p className="text-white/60 text-base max-w-md mx-auto leading-relaxed">
                        Безкоштовні інструменти та документы для орендарів
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {resources.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-7
                                       hover:border-[#FF6B35]/50 hover:bg-white/[0.08] transition-all duration-300 shadow-lg overflow-hidden"
                        >
                            {/* М'який підсвіт при наведенні */}
                            <div
                                className="absolute bottom-0 left-0 w-32 h-32 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{ background: "radial-gradient(circle at 0% 100%, rgba(255,107,53,0.15) 0%, transparent 70%)" }}
                            />

                            <div>
                                <div className="flex items-center justify-center w-12 h-12 rounded-xl
                                                bg-[#FF6B35]/15 text-[#FF6B35] border border-[#FF6B35]/20 mb-5
                                                group-hover:bg-[#FF6B35] group-hover:text-white transition-all duration-300 shadow-sm">
                                    {item.icon}
                                </div>

                                <h3
                                    className="text-white font-bold text-lg mb-3 group-hover:text-[#FF6B35] transition-colors duration-200"
                                    style={{ fontFamily: "'Unbounded', sans-serif" }}
                                >
                                    {item.title}
                                </h3>
                                <p className="text-white/60 text-sm mb-6 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>

                            <span
                                className="inline-flex items-center gap-2 text-[#FF6B35] text-xs font-bold
                                           group-hover:gap-3 transition-all duration-200 uppercase tracking-wider"
                                style={{ fontFamily: "'Unbounded', sans-serif" }}
                            >
                                {item.cta}
                                <ArrowRight className="w-4 h-4" />
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}