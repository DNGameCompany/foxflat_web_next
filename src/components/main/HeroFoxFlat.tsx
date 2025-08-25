"use client";

import IphoneMockup from "@/src/components/main/PhoneMockup";

export default function HeroFoxFlat() {
    return (
        <section className="relative overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-24 sm:py-32">
                    {/* Текст ліворуч */}
                    <div className="max-w-xl">
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                            FoxFlat — Telegram-бот для оренди квартир в Україні
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-300">
                            Моніторинг квартир у 22-х містах України. Отримуй сповіщення та бронюй квартири першим. Наразі діє безкоштовна акція.
                        </p>
                        <div className="mt-10 flex gap-x-6">
                            <a
                                href="https://t.me/FoxFlat_bot"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-md bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-3 text-base font-semibold text-black shadow-sm hover:from-orange-400 hover:to-orange-300 transition"
                            >
                                Запустити бота
                            </a>
                        </div>
                    </div>

                    <div className="flex justify-center lg:justify-end lg:pr-16">
                        <IphoneMockup videoSrc="/videos/phone-screen-video.mp4" width={330} />
                    </div>
                </div>
            </div>
        </section>
    );
}
