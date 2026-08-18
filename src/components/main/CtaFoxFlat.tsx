"use client";

import { event } from "@/lib/gtag";

export default function CtaFoxFlat() {
    const handleBotClick = () => {
        event({
            action: "telegram_bot_click",
            category: "engagement",
            label: "CTA section bot link",
        });
    };

    return (
        <section className="relative w-full bg-[#1E1E2E] text-white py-20 px-4 sm:px-6 overflow-hidden">
            <div className="relative max-w-5xl mx-auto">
                <div
                    className="
                        relative isolate overflow-hidden
                        rounded-3xl p-8 sm:p-12 lg:p-16 text-center
                        border border-[#FF6B35]/30 bg-white/5
                        shadow-[0_0_30px_rgba(255,107,53,0.1)]
                        hover:border-[#FF6B35]/60 hover:shadow-[0_0_40px_rgba(255,107,53,0.2)]
                        transition-all duration-300
                    "
                >
                    {/* Фонове сяйво всередині картки */}
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] pointer-events-none"
                        style={{
                            background:
                                "radial-gradient(ellipse, rgba(255,107,53,0.15) 0%, transparent 70%)",
                        }}
                    />

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <p className="text-xs font-extrabold tracking-widest text-[#FF6B35] uppercase mb-3">
                            FoxFlat Bot
                        </p>

                        <h2
                            className="font-extrabold text-white leading-tight mb-4"
                            style={{
                                fontFamily: "'Unbounded', sans-serif",
                                fontSize: "clamp(26px, 3.5vw, 42px)",
                                letterSpacing: "-1px",
                            }}
                        >
                            Почни пошук квартири зараз
                        </h2>

                        <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
                            FoxFlat надсилає актуальні оголошення про квартири в Києві, Львові, Одесі, Харкові та ще 18 містах України.
                            Запусти Telegram-бота та отримуй найсвіжіші пропозиції щодня, швидко знаходь квартири та будь першим, хто дізнається про нові оголошення.
                        </p>

                        <div className="flex justify-center">
                            <a
                                href="https://t.me/FoxFlat_bot?start=website"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={handleBotClick}
                                className="
                                    inline-flex items-center gap-2.5 px-8 py-4 rounded-xl
                                    bg-[#FF6B35] hover:bg-[#e05a2b] text-white font-bold text-xs
                                    shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0
                                    transition-all duration-200 uppercase tracking-wider
                                "
                                style={{ fontFamily: "'Unbounded', sans-serif" }}
                            >
                                Запустити бота
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path
                                        d="M3 8h10M9 4l4 4-4 4"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}