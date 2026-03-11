"use client";

import IphoneMockup from "@/src/components/main/PhoneMockup";
import { event } from "@/lib/gtag";

export default function HeroFoxFlat() {
    const handleBotClick = () => {
        event({
            action: "telegram_bot_click",
            category: "engagement",
            label: "Hero section bot link",
        });
    };

    return (
        <section className="relative overflow-hidden">

            {/* Glow background */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute left-1/2 top-[-10%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-orange-500/20 blur-3xl"></div>
            </div>

            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-24 sm:py-32">

                    {/* Текст */}
                    <div className="max-w-xl text-center lg:text-left mx-auto lg:mx-0">

                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                            FoxFlat — Telegram-бот для швидкої оренди квартир в Україні
                        </h1>

                        <h2 className="mt-4 text-2xl font-semibold text-gray-300">
                            Актуальні оголошення оренди квартир у 22 містах України: Київ, Львів, Одеса, Харків та інші
                        </h2>

                        <p className="mt-6 text-lg leading-8 text-gray-300 max-w-lg">
                            Знімай квартиру швидко та без зайвих пошуків. FoxFlat миттєво надсилає нові оголошення оренди прямо в Telegram, щоб ти був першим, хто дізнається про доступні квартири.
                        </p>

                        {/* Кнопка */}
                        <div className="mt-10 flex justify-center lg:justify-start">
                            <a
                                href="https://t.me/FoxFlat_bot?start=website"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={handleBotClick}
                                className="w-full sm:w-auto rounded-md bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-3 text-base font-semibold text-black shadow-sm hover:from-orange-400 hover:to-orange-300 transition"
                            >
                                Запустити бота
                            </a>
                        </div>

                    </div>

                    {/* Телефон */}
                    <div className="flex justify-center lg:justify-end lg:pr-16">
                        <IphoneMockup
                            videoSrc="/videos/phone-screen-video.mp4"
                            width={330}
                        />
                    </div>

                </div>
            </div>
        </section>
    );
}