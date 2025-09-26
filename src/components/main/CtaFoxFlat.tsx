"use client";

import {event} from "@/lib/gtag";

export default function CtaFoxFlat() {
    const handleBotClick = () => {
        event({
            action: "telegram_bot_click",
            category: "engagement",
            label: "CTA section bot link",
        })
    }

    return (
        <section
            className="
                relative isolate overflow-hidden
                backdrop-blur-sm
                py-24 sm:py-32
                rounded-3xl mx-4 sm:mx-8 my-12
                shadow-[inset_0_0_0_1px_rgba(255,122,0,0.2),0_0_30px_rgba(255,122,0,0.1)]
                transition hover:shadow-[inset_0_0_0_1px_rgba(255,150,0,0.4),0_0_40px_rgba(255,150,0,0.15)]
            "
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Почни пошук квартири зараз
                </h2>
                <p className="mt-4 text-lg leading-8 text-gray-300 max-w-2xl mx-auto">
                    FoxFlat надсилає актуальні оголошення про квартири в Києві, Львові, Одесі, Харкові та ще 18 містах України.
                    Запусти Telegram-бота та отримуй найсвіжіші пропозиції щодня, швидко знаходь квартири та будь першим, хто дізнається про нові оголошення.
                </p>
                <div className="mt-8 flex justify-center">
                    <a
                        href="https://t.me/FoxFlat_bot"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleBotClick}
                        className="rounded-md bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-3 text-base font-semibold text-black shadow-sm hover:from-orange-400 hover:to-orange-300 transition"
                    >
                        Запустити бота
                    </a>
                </div>
            </div>
        </section>
    );
}
