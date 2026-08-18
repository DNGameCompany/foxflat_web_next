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
        <section className="relative overflow-hidden bg-white text-[#1E1E2E]">

            {/* М'який акцентний фоновий глоу в стилі помаранчевого банера */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute left-1/2 top-[-10%] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#FF6B35]/15 blur-3xl" />
            </div>

            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-16 sm:py-24">

                    {/* Текстовий блок */}
                    <div className="max-w-xl text-center lg:text-left mx-auto lg:mx-0">

                        <h1 className="text-4xl font-extrabold tracking-tight text-[#1E1E2E] sm:text-5xl lg:text-6xl leading-tight">
                            FoxFlat — Telegram-бот для швидкої оренди квартир в Україні
                        </h1>

                        <h2 className="mt-5 text-xl sm:text-2xl font-semibold text-[#FF6B35]">
                            Актуальні оголошення оренди квартир у 22 містах України: Київ, Львів, Одеса, Харків та інші
                        </h2>

                        <p className="mt-6 text-lg leading-relaxed text-[#1E1E2E]/80 max-w-lg">
                            Знімай квартиру швидко та без зайвих пошуків. FoxFlat миттєво надсилає нові оголошення оренди прямо в Telegram, щоб ти був першим, хто дізнається про доступні квартири.
                        </p>

                        {/* Кнопки та заклик до дії */}
                        <div className="mt-8 flex justify-center lg:justify-start">
                            <a
                                href="https://t.me/FoxFlat_bot?start=website"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={handleBotClick}
                                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-[#FF6B35] px-8 py-4 text-lg font-bold text-white shadow-lg hover:bg-[#e05a2b] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                            >
                                Запустити бота
                            </a>
                        </div>

                    </div>

                    {/* Макет телефону */}
                    <div className="flex justify-center lg:justify-end lg:pr-8">
                        <div className="relative">
                            {/* Геометрична декоративна підкладка в стилі flat-дизайну */}
                            <div className="absolute -inset-4 rounded-3xl bg-[#1E1E2E]/5 -rotate-2 -z-10" />
                            <IphoneMockup
                                imageSrc="/images/screen_mock.webp"
                                width={330}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}