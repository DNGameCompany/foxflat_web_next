"use client";

import { useState } from "react";
import Image from "next/image";
import { event } from "@/lib/gtag";

const JAR_URL = "https://send.monobank.ua/jar/2BrMzU78xp";
const CARD_NUMBER = "4874 1000 3087 1001";

type Tab = "link" | "qr";

// ⬇️ Сюди додаєш нові звіти (нові зверху)
const REPORTS = [
    {
        date: "15.08.2026",
        title: "Звіт за 15 серпня",
        url: "https://www.instagram.com/p/DcEJQ0LjMZS/?igsh=MTcwczU1Nnp1Yjd6cw==",
    },
    // {
    //   date: "14.08.2026",
    //   title: "Звіт за 14 серпня",
    //   url: "https://www.instagram.com/p/XXXXX/",
    // },
];

export default function DonateFoxFlat() {
    const [tab, setTab] = useState<Tab>("link");
    const [copied, setCopied] = useState(false);

    const handleDonateClick = () => {
        event({
            action: "donate_click",
            category: "engagement",
            label: "Donate section — 79 ПЗ ДПСУ",
        });
    };

    const handleTabChange = (next: Tab) => {
        setTab(next);
        event({
            action: "donate_tab_switch",
            category: "engagement",
            label: `Donate section — ${next} tab`,
        });
    };

    const handleCopyCard = async () => {
        try {
            await navigator.clipboard.writeText(CARD_NUMBER.replace(/\s/g, ""));
            setCopied(true);
            event({
                action: "donate_card_copy",
                category: "engagement",
                label: "Donate section — card number copied",
            });
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // clipboard недоступний
        }
    };

    const handleReportClick = (date: string) => {
        event({
            action: "donate_report_click",
            category: "engagement",
            label: `Donate section — report ${date}`,
        });
    };

    return (
        <section className="relative overflow-hidden py-16 sm:py-20 lg:py-28">
            {/* Background glow */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-blue-500/15 blur-[100px] sm:h-[500px] sm:w-[500px] lg:h-[600px] lg:w-[600px] lg:blur-[120px]" />
                <div className="absolute right-[-15%] bottom-0 h-[300px] w-[300px] rounded-full bg-amber-400/10 blur-[80px] sm:h-[400px] sm:w-[400px] lg:right-[-10%] lg:h-[500px] lg:w-[500px]" />
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 items-center gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">

                    {/* Банер */}
                    <div className="order-2 flex justify-center lg:order-1 lg:justify-start">
                        <div className="relative w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[440px]">
                            <div className="absolute -inset-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-amber-400/20 opacity-50 blur-xl sm:-inset-4 sm:rounded-3xl sm:blur-2xl" />

                            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl shadow-black/30 backdrop-blur-sm sm:rounded-3xl sm:shadow-2xl">
                                <Image
                                    src="/images/donate-banner.webp"
                                    alt="Збір на 79 ПЗ ДПСУ: антени керування, посилювач та кабель"
                                    width={440}
                                    height={500}
                                    className="h-auto w-full object-cover"
                                    priority
                                    sizes="(max-width: 640px) 320px, (max-width: 1024px) 380px, 440px"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Контент */}
                    <div className="order-1 mx-auto w-full max-w-xl text-center lg:order-2 lg:mx-0 lg:text-left">

                        {/* Badge */}
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm sm:mb-5 sm:px-4">
                            <span className="text-base leading-none">🇺🇦</span>
                            <span>Підтримка ЗСУ</span>
                        </div>

                        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-[2.5rem] lg:leading-[1.15]">
                            Збір на 79 ПЗ ДПСУ
                        </h2>

                        <p className="mt-4 text-base leading-relaxed text-gray-300 sm:mt-5 sm:text-lg">
                            Антени керування, посилювач та кабель. FoxFlat допомагає
                            українцям знаходити житло, а разом з вами ми можемо допомогти
                            тим, хто захищає нашу країну. Кожен донат наближає перемогу.
                        </p>

                        <p className="mt-3 text-sm font-medium text-amber-400 sm:mt-4 sm:text-base">
                            Ціль збору: 150 000 ₴
                        </p>

                        {/* Donate card */}
                        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/20 backdrop-blur-md sm:mt-10 sm:rounded-3xl">

                            {/* Tabs */}
                            <div className="flex border-b border-white/10">
                                <button
                                    onClick={() => handleTabChange("link")}
                                    className={`relative flex-1 py-3.5 text-sm font-semibold transition-colors sm:py-4 ${
                                        tab === "link"
                                            ? "text-white"
                                            : "text-gray-400 hover:text-gray-200"
                                    }`}
                                >
                                    Посилання
                                    {tab === "link" && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-amber-400" />
                                    )}
                                </button>
                                <button
                                    onClick={() => handleTabChange("qr")}
                                    className={`relative flex-1 py-3.5 text-sm font-semibold transition-colors sm:py-4 ${
                                        tab === "qr"
                                            ? "text-white"
                                            : "text-gray-400 hover:text-gray-200"
                                    }`}
                                >
                                    QR-код
                                    {tab === "qr" && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-amber-400" />
                                    )}
                                </button>
                            </div>

                            {/* Tab content */}
                            <div className="p-5 sm:p-6 lg:p-7">
                                {tab === "link" ? (
                                    <a
                                        href={JAR_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={handleDonateClick}
                                        className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-amber-400 px-5 py-3 text-sm font-bold text-black shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:brightness-105 active:scale-[0.98] sm:rounded-2xl sm:px-6 sm:py-3.5 sm:text-base"
                                    >
                                        <span>Задонатити на банку</span>
                                        <svg
                                            className="h-4 w-4 transition-transform group-hover:translate-x-0.5 sm:h-5 sm:w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2.5}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                            />
                                        </svg>
                                    </a>
                                ) : (
                                    <div className="flex justify-center">
                                        <a
                                            href={JAR_URL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={handleDonateClick}
                                            className="inline-block overflow-hidden rounded-xl bg-white p-3.5 shadow-lg transition-all active:scale-[0.98] sm:rounded-2xl sm:p-5 sm:hover:scale-[1.02] sm:hover:shadow-xl"
                                        >
                                            <Image
                                                src="/images/donate-qr.webp"
                                                alt="QR-код для донату на банку 79 ПЗ ДПСУ"
                                                width={240}
                                                height={240}
                                                className="h-auto w-[200px] rounded-lg sm:w-[240px] sm:rounded-xl"
                                                sizes="(max-width: 640px) 200px, 240px"
                                            />
                                        </a>
                                    </div>
                                )}

                                {/* Card number */}
                                <div className="mt-6 border-t border-white/10 pt-5 sm:mt-7 sm:pt-6">
                                    <p className="mb-3 text-center text-sm text-gray-400 lg:text-left">
                                        Або переказ на картку monobank
                                    </p>

                                    <button
                                        onClick={handleCopyCard}
                                        className="group flex w-full flex-col items-center gap-2.5 rounded-xl border border-white/10 bg-black/30 px-4 py-3 transition-all hover:border-white/20 hover:bg-black/40 active:scale-[0.99] sm:flex-row sm:justify-between sm:gap-3 sm:rounded-2xl sm:px-5 sm:py-3.5"
                                    >
                    <span className="font-mono text-sm tracking-wide text-white sm:text-[15px]">
                      {CARD_NUMBER}
                    </span>

                                        <span
                                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                                                copied
                                                    ? "bg-emerald-500/20 text-emerald-400"
                                                    : "bg-white/10 text-gray-300 group-hover:bg-white/15 group-hover:text-white"
                                            }`}
                                        >
                      {copied ? (
                          <>
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                              Скопійовано
                          </>
                      ) : (
                          <>
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                              </svg>
                              Копіювати
                          </>
                      )}
                    </span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Звіти */}
                        {REPORTS.length > 0 && (
                            <div className="mt-8 sm:mt-10">
                                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
                                    Звіти по збору
                                </h3>

                                <ul className="space-y-2">
                                    {REPORTS.map((report) => (
                                        <li key={report.url}>
                                            <a
                                                href={report.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={() => handleReportClick(report.date)}
                                                className="group flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-all hover:border-white/20 hover:bg-white/[0.06] active:scale-[0.99]"
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                          <span className="shrink-0 rounded-lg bg-white/10 px-2.5 py-1 text-xs font-medium text-gray-300">
                            {report.date}
                          </span>
                                                    <span className="truncate text-sm text-white group-hover:text-amber-300 transition-colors">
                            {report.title}
                          </span>
                                                </div>

                                                <svg
                                                    className="h-4 w-4 shrink-0 text-gray-500 transition-transform group-hover:translate-x-0.5 group-hover:text-white"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                                    />
                                                </svg>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}