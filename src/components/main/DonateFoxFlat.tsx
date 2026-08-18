"use client";

import { useState } from "react";
import Image from "next/image";
import { event } from "@/lib/gtag";

const JAR_URL = "https://send.monobank.ua/jar/2BrMzU78xp";
const CARD_NUMBER = "4874 1000 3087 1001";

type Tab = "link" | "qr";

const REPORTS = [
    {
        date: "15.08.2026",
        title: "Звіт за 15 серпня",
        url: "https://www.instagram.com/p/DcEJQ0LjMZS/?igsh=MTcwczU1Nnp1Yjd6cw==",
    },
];

export default function DonateFoxFlat() {
    const [tab, setTab] = useState<Tab>("link");
    const [copied, setCopied] = useState(false);

    const handleDonateClick = () => {
        event({ action: "donate_click", category: "engagement", label: "Donate section — 79 ПЗ ДПСУ" });
    };

    const handleTabChange = (next: Tab) => {
        setTab(next);
        event({ action: "donate_tab_switch", category: "engagement", label: `Donate section — ${next} tab` });
    };

    const handleCopyCard = async () => {
        try {
            await navigator.clipboard.writeText(CARD_NUMBER.replace(/\s/g, ""));
            setCopied(true);
            event({ action: "donate_card_copy", category: "engagement", label: "Donate section — card number copied" });
            setTimeout(() => setCopied(false), 2000);
        } catch {}
    };

    return (
        <section className="relative w-full bg-[#1E1E2E] text-white overflow-hidden py-16 sm:py-20 lg:py-24">
            {/* Акуратне фонове сяйво за банером */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[450px] h-[450px] bg-[#FF6B35]/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">

                    {/* Банер */}
                    <div className="order-2 flex justify-center lg:order-1">
                        <div className="relative w-full max-w-[340px] sm:max-w-[400px]">
                            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
                                <Image
                                    src="/images/donate-banner.webp"
                                    alt="Збір на 79 ПЗ ДПСУ"
                                    width={440}
                                    height={500}
                                    className="h-auto w-full object-cover"
                                    priority
                                    sizes="(max-width: 640px) 320px, 440px"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Інформація */}
                    <div className="order-1 text-center lg:text-left">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#FF6B35]/30 bg-[#FF6B35]/10 px-3.5 py-1.5 text-xs font-semibold text-[#FF6B35]">
                            <span>🇺🇦</span>
                            <span>Підтримка ЗСУ</span>
                        </div>

                        <h2
                            className="font-extrabold text-white leading-tight mb-4"
                            style={{ fontFamily: "'Unbounded', sans-serif", fontSize: "clamp(26px, 3.2vw, 38px)" }}
                        >
                            Збір на <span className="text-[#FF6B35]">79 ПЗ ДПСУ</span>
                        </h2>

                        <p className="text-white/70 text-base leading-relaxed mb-6">
                            Антени керування, посилювач та кабель. FoxFlat допомагає знайти житло, а разом ми підтримуємо тих, хто захищає наш дім.
                        </p>

                        {/* Форма донату */}
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 backdrop-blur-sm">
                            <div className="flex border-b border-white/10 mb-5">
                                <button
                                    onClick={() => handleTabChange("link")}
                                    className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                                        tab === "link" ? "text-[#FF6B35] border-b-2 border-[#FF6B35]" : "text-white/40 hover:text-white/70"
                                    }`}
                                >
                                    Посилання
                                </button>
                                <button
                                    onClick={() => handleTabChange("qr")}
                                    className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                                        tab === "qr" ? "text-[#FF6B35] border-b-2 border-[#FF6B35]" : "text-white/40 hover:text-white/70"
                                    }`}
                                >
                                    QR-код
                                </button>
                            </div>

                            {tab === "link" ? (
                                <a
                                    href={JAR_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={handleDonateClick}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6B35] hover:bg-[#e05a2b] py-3.5 text-sm font-bold text-white transition-all shadow-lg shadow-[#FF6B35]/20 active:scale-[0.99]"
                                    style={{ fontFamily: "'Unbounded', sans-serif" }}
                                >
                                    <span>Задонатити на банку</span>
                                    <span>→</span>
                                </a>
                            ) : (
                                <div className="flex justify-center py-2">
                                    <Image
                                        src="/images/donate-qr.webp"
                                        alt="QR-код Монобанк"
                                        width={200}
                                        height={200}
                                        className="rounded-xl bg-white p-2"
                                    />
                                </div>
                            )}

                            {/* Картка */}
                            <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                                <span className="font-mono text-xs text-white/60">{CARD_NUMBER}</span>
                                <button
                                    onClick={handleCopyCard}
                                    className="text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30 text-white/80 transition-colors"
                                >
                                    {copied ? "✓ Скопійовано" : "Копіювати картку"}
                                </button>
                            </div>
                        </div>

                        {/* Звіти */}
                        {REPORTS.length > 0 && (
                            <div className="mt-6 text-left">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-white/40 block mb-2">Останні звіти:</span>
                                {REPORTS.map((r) => (
                                    <a key={r.url} href={r.url} target="_blank" rel="noreferrer" className="text-xs text-white/70 hover:text-[#FF6B35] underline underline-offset-4 transition-colors">
                                        {r.date} — {r.title}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
}