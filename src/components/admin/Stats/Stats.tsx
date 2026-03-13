"use client";

import React, { useState } from "react";
import RegistrationsChart from "./RegistrationsChart";
import ConversionChart from "./ConversionChart";
import FiltersChart from "./FiltersChart";
import CitiesChart from "./CitiesChart";

interface StatSection {
    id: string;
    title: string;
    description: string;
    preview: React.ReactNode;
    component: React.ReactNode;
}

// Мінімальні прев'ю для кожної плитки
function PreviewBar({ values }: { values: number[] }) {
    const max = Math.max(...values, 1);
    return (
        <div className="flex items-end gap-0.5 h-8">
            {values.map((v, i) => (
                <div key={i} className="flex-1 rounded-sm bg-orange-500/40"
                     style={{ height: `${Math.round((v / max) * 100)}%`, minHeight: 2 }} />
            ))}
        </div>
    );
}

function PreviewDonut({ pct }: { pct: number }) {
    const r = 16, circ = 2 * Math.PI * r;
    return (
        <svg width="44" height="44" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
            <circle cx="22" cy="22" r={r} fill="none" stroke="#F97316" strokeWidth="5"
                    strokeDasharray={`${circ * pct / 100} ${circ}`}
                    strokeLinecap="round"
                    transform="rotate(-90 22 22)" />
            <text x="22" y="26" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#F97316">{pct}%</text>
        </svg>
    );
}

const sections: StatSection[] = [
    {
        id: "registrations",
        title: "Реєстрації",
        description: "Динаміка нових юзерів",
        preview: <PreviewBar values={[3,7,5,12,8,15,10,18,14,20,16,22]} />,
        component: <RegistrationsChart />,
    },
    {
        id: "conversion",
        title: "Конверсія",
        description: "Free → Premium",
        preview: <PreviewDonut pct={34} />,
        component: <ConversionChart />,
    },
    {
        id: "cities",
        title: "Міста",
        description: "Розподіл по містах",
        preview: <PreviewBar values={[33,11,8,6,4,2,2,2,1,1,1,1]} />,
        component: <CitiesChart />,
    },
    {
        id: "filters",
        title: "Фільтри",
        description: "Параметри пошуку юзерів",
        preview: <PreviewBar values={[20,15,18,8,12,5,9,14,6,10]} />,
        component: <FiltersChart />,
    },
];

function Tile({ section }: { section: StatSection }) {
    const [open, setOpen] = useState(false);

    return (
        <div className={`rounded-xl border transition-all duration-200 overflow-hidden ${
            open
                ? "border-orange-500/25 bg-white/[0.02] col-span-full"
                : "border-white/[0.07] bg-white/[0.015] hover:border-white/[0.12] hover:bg-white/[0.025] cursor-pointer"
        }`}>
            {/* Хедер — завжди видимий */}
            <button
                onClick={() => setOpen((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-4 text-left group"
            >
                <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-1 h-5 rounded-full flex-shrink-0 transition-colors duration-200 ${
                        open ? "bg-orange-500" : "bg-white/10 group-hover:bg-white/25"
                    }`} />
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-white/70 group-hover:text-white/90 transition-colors truncate"
                           style={{ fontFamily: "'Unbounded', sans-serif" }}>
                            {section.title}
                        </p>
                        <p className="text-[11px] text-white/25 mt-0.5 truncate">{section.description}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                    {/* Прев'ю тільки коли згорнуто */}
                    {!open && (
                        <div className="opacity-60">
                            {section.preview}
                        </div>
                    )}
                    <svg
                        width="14" height="14" viewBox="0 0 16 16" fill="none"
                        className={`transition-transform duration-200 flex-shrink-0 ${
                            open ? "rotate-180 text-orange-400" : "text-white/20"
                        }`}
                    >
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </button>

            {/* Розгорнутий контент */}
            {open && (
                <div className="px-4 pb-5 pt-1 border-t border-white/[0.05]">
                    {section.component}
                </div>
            )}
        </div>
    );
}

export default function StatsTab() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sections.map((section) => (
                <Tile key={section.id} section={section} />
            ))}
        </div>
    );
}