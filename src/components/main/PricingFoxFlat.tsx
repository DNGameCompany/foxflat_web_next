"use client";

import { CheckIcon, FireIcon } from "@heroicons/react/20/solid";
import { event } from "@/lib/gtag";

const tiers = [
    {
        name: "Безкоштовно",
        id: "tier-free",
        href: "https://t.me/FoxFlat_bot",
        priceMonthly: "0 грн",
        description: "Ідеально, щоб спробувати пошук квартир у Києві, Львові, Одесі чи Харкові. Отримуй нові оголошення кожного дня.",
        features: [
            "Автоматичний пошук нових квартир з оновленням кожні 30 хвилин.",
            "Можливість одноразової зміни фільтру.",
            "Застосування одного параметра в кожному фільтрі.",
            "Максимум 3 переходи по посиланням на добу.",
        ],
        featured: false,
    },
    {
        name: "Місячна підписка",
        id: "tier-premium",
        href: "https://t.me/FoxFlat_bot",
        priceMonthly: "0 грн",
        description: "Преміум-доступ для тих, хто хоче знаходити квартири миттєво. Оновлення кожні 5 хвилин і необмежені фільтри у 22 містах України.",
        features: [
            "Моніторинг кожні 5 хвилин.",
            "Необмежена кількість змін параметрів фільтрів.",
            "Підтримка декількох районів та фільтр за наявністю тварин.",
            "Необмежена кількість переходів за посиланнями.",
        ],
        featured: true,
    },
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export default function PricingFoxFlat() {
    const handleBotClick = (action: string, label: string) => {
        event({
            action,
            category: "engagement",
            label,
        });
    };
    return (
        <div className="relative isolate px-6 py-24 sm:py-32 lg:px-8 overflow-hidden w-full">
            {/* Фон із блюром і димкою на всю ширину */}
            <div
                aria-hidden="true"
                className="absolute inset-0 z-0
        bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),
             linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)]
        bg-[size:40px_40px]
        backdrop-blur-sm bg-white/5
        [mask-image:linear-gradient(to_bottom,transparent,white_20%,white_80%,transparent)]
        pointer-events-none"
            />

            {/* Заголовок */}
            <div className="relative z-10 mx-auto max-w-4xl text-center">
                <h2 className="text-base font-semibold text-orange-400">
                    FoxFlat Підписка
                </h2>
                <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                    Швидкий доступ до нових квартир у твоєму місті
                </p>
            </div>

            {/* 🔥 Блок акції */}
            <div className="relative z-10 mx-auto mt-10 mb-8 max-w-2xl text-center rounded-xl border border-orange-400 p-4 bg-orange-500/10 text-orange-300 shadow-[0_0_25px_-8px_rgba(251,146,60,0.5)] animate-pulsePromo transition-all duration-300">
                <div className="flex items-center justify-center gap-2 font-semibold text-base">
                    <FireIcon className="h-5 w-5 text-orange-400 animate-bounce" />
                    Спеціальна пропозиція:{" "}
                    <span className="text-orange-100">преміум зараз безкоштовно!</span>
                </div>
                <p className="mt-1 text-sm text-orange-200">
                    Звичайна ціна <span className="line-through">200 грн</span> / місяць — тільки зараз{" "}
                    <span className="font-bold text-white">0 грн</span>
                </p>
            </div>

            {/* Ціни */}
            <div className="relative z-10 mx-auto mt-8 grid max-w-lg grid-cols-1 gap-y-6 sm:mt-12 lg:max-w-4xl lg:grid-cols-2">
                {tiers.map((tier) => (
                    <div
                        key={tier.id}
                        className={classNames(
                            tier.featured
                                ? "bg-orange-400/5 border border-orange-400 shadow-[0_0_30px_-10px_rgba(251,146,60,0.5)] hover:shadow-[0_0_40px_-5px_rgba(251,146,60,0.6)] scale-100 hover:scale-[1.02] transition-all duration-300"
                                : "bg-transparent",
                            "rounded-3xl p-8 ring-1 ring-white/10 sm:p-10"
                        )}
                    >
                        <h3
                            id={tier.id}
                            className={classNames(
                                tier.featured ? "text-orange-400" : "text-orange-300",
                                "text-base font-semibold"
                            )}
                        >
                            {tier.name}
                        </h3>
                        <p className="mt-4 flex items-baseline gap-x-2">
                            <span className="text-white text-4xl font-bold tracking-tight">
                                {tier.priceMonthly}
                            </span>
                            <span className="text-gray-400 text-base">/місяць</span>
                        </p>
                        <p className="mt-6 text-base text-gray-300">{tier.description}</p>
                        <ul
                            role="list"
                            className="mt-8 space-y-3 text-sm text-gray-300 sm:mt-10"
                        >
                            {tier.features.map((feature) => (
                                <li key={feature} className="flex gap-x-3">
                                    <CheckIcon
                                        aria-hidden="true"
                                        className="h-6 w-5 flex-none text-orange-400"
                                    />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <a
                            href={tier.href}
                            target="_blank"
                            aria-describedby={tier.id}
                            onClick={() =>
                                handleBotClick(
                                    tier.id,
                                    tier.name
                                )
                            }
                            className={classNames(
                                tier.featured
                                    ? "bg-orange-500 text-black hover:bg-orange-400 focus-visible:outline-orange-500"
                                    : "text-orange-400 ring-1 ring-orange-400 hover:bg-orange-400 hover:text-black focus-visible:outline-orange-600",
                                "mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10"
                            )}
                        >
                            {tier.featured ? "Оформити підписку" : "Спробувати безкоштовно"}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}