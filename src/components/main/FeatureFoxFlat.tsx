import { BellRing, Filter, Zap, Clock, RefreshCw, Send } from "lucide-react";

export default function FeatureFoxFlat() {
    const features = [
        {
            icon: <BellRing className="h-6 w-6 text-orange-400 transition hover:text-orange-300" aria-label="Миттєві сповіщення квартир у Києві" />,
            title: "Миттєві сповіщення",
            description: "Отримуй нові квартири в Києві, Львові, Одесі та інших містах України одразу після публікації."
        },
        {
            icon: <Filter className="h-6 w-6 text-orange-400 transition hover:text-orange-300" aria-label="Гнучкі фільтри для пошуку квартир" />,
            title: "Гнучкі фільтри",
            description: "Фільтруй квартири за ціною, районом, кількістю кімнат та іншими параметрами для швидкого пошуку."
        },
        {
            icon: <Zap className="h-6 w-6 text-orange-400 transition hover:text-orange-300" aria-label="Бронювання квартир першим" />,
            title: "Бронювання першим",
            description: "Встигаєш першим зв’язатися з власником і забронювати квартиру через Telegram-бот."
        },
        {
            icon: <Clock className="h-6 w-6 text-orange-400 transition hover:text-orange-300" aria-label="Цілодобова робота FoxFlat" />,
            title: "Цілодобова робота",
            description: "FoxFlat працює 24/7 і надсилає нові оголошення навіть вночі."
        },
        {
            icon: <RefreshCw className="h-6 w-6 text-orange-400 transition hover:text-orange-300" aria-label="Оновлення квартир в реальному часі" />,
            title: "Оновлення в реальному часі",
            description: "Моніторинг популярних платформ з оновленнями квартир у режимі реального часу."
        },
        {
            icon: <Send className="h-6 w-6 text-orange-400 transition hover:text-orange-300" aria-label="Усі сповіщення в Telegram" />,
            title: "У Telegram",
            description: "Отримуй всі нові квартири одразу в Telegram без додаткових застосунків."
        },
    ];

    return (
        <section
            className="bg-[#0f172a] min-h-screen py-24 sm:py-32 flex flex-col justify-center"
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full">
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-base font-semibold leading-7 text-orange-400">Переваги FoxFlat</p>
                    <h2 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                        Оренда квартир у Києві, Львові, Одесі та Харкові за допомогою Telegram-бота
                    </h2>
                    <p className="mt-6 text-lg leading-8 text-gray-300">
                        FoxFlat щосекунди перевіряє популярні платформи оголошень і надсилає оновлення у 22 містах України.
                        Більше не потрібно витрачати години на пошук — усі квартири одразу в одному зручному боті.
                    </p>
                </div>
                <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-x-4">
                            {feature.icon}
                            <div>
                                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                                <p className="mt-2 text-sm text-gray-300">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
