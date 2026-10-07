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
                            FoxFlat — Telegram-бот, який сповіщує про нові оголошення оренди квартир
                        </h1>

                        <h2 className="mt-4 text-2xl font-semibold text-gray-300">
                            Працює у 22 містах України: Київ, Львів, Одеса, Харків та інших
                        </h2>

                        <p className="mt-6 text-lg leading-8 text-gray-300 max-w-lg">
                            Налаштуй фільтри один раз — і FoxFlat надсилатиме тобі в Telegram нові оголошення з популярних платформ. Не потрібно самому оновлювати сайти.
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
                                Налаштувати сповіщення
                            </a>
                        </div>

                        {/* Уточнення */}
                        <p className="mt-4 text-sm text-gray-500">
                            Це бот-сповіщувач, а не каталог: він надсилає лише нові оголошення, без архіву й перегляду бази.
                        </p>

                    </div>

                    {/* Телефон */}
                    <div className="flex justify-center lg:justify-end lg:pr-16">
                        <IphoneMockup
                            imageSrc="/images/screen_mock.webp"
                            width={330}
                        />
                    </div>

                </div>
            </div>
        </section>
    );
}