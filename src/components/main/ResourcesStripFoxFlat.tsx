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
        <section className="max-w-6xl mx-auto px-4 py-16">
            <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Корисно при оренді
                </h2>
                <p className="text-white/50 mt-2">
                    Безкоштовні інструменти та документи для орендарів
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {resources.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-6
                                   hover:border-orange-400/40 hover:bg-white/[0.06] transition-all duration-300"
                    >
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl
                                        bg-orange-400/10 text-orange-400 mb-4
                                        group-hover:bg-orange-400/20 transition-colors">
                            {item.icon}
                        </div>

                        <h3 className="text-white font-semibold text-lg mb-2">
                            {item.title}
                        </h3>
                        <p className="text-white/50 text-sm mb-4 leading-relaxed">
                            {item.description}
                        </p>

                        <span className="inline-flex items-center gap-1.5 text-orange-400 text-sm font-medium
                                          group-hover:gap-2.5 transition-all">
                            {item.cta}
                            <ArrowRight className="w-4 h-4" />
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}