"use client";

import IphoneMockup from "@/src/components/main/PhoneMockup";
import { event } from "@/lib/gtag"  // 👈 твоя функція відправки подій

export default function HeroFoxFlat() {
    const handleBotClick = () => {
        event({
            action: "telegram_bot_click",
            category: "engagement",
            label: "Hero section bot link",
        })
    }
    return (
        <section className="relative overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-24 sm:py-32">
                    {/* Текст ліворуч */}
                    <div className="max-w-xl">
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                            FoxFlat — Telegram-бот для швидкої оренди квартир в Україні
                        </h1>
                        <h2 className="mt-4 text-2xl font-semibold text-gray-300">
                            Актуальні оголошення оренди квартир у 22 містах України: Київ, Львів, Одеса, Харків та інші
                        </h2>
                        <p className="mt-6 text-lg leading-8 text-gray-300">
                            Знімай квартиру швидко та без зайвих пошуків. FoxFlat миттєво надсилає нові оголошення оренди прямо в Telegram, щоб ти був першим, хто дізнається про доступні квартири.
                        </p>

                        <div className="mt-10 flex gap-x-6">
                            <a
                                href="https://t.me/FoxFlat_bot?start=website"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={handleBotClick}
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
