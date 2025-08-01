import { BellRing, Filter, Zap, Clock, RefreshCw, Send } from "lucide-react";

export default function FeatureFoxFlat() {
    const features = [
        {
            icon: <BellRing className="h-6 w-6 text-orange-400 transition hover:text-orange-300" />,
            title: "Миттєві сповіщення",
            description: "Отримуй повідомлення про нові квартири за секунди після публікації.",
        },
        {
            icon: <Filter className="h-6 w-6 text-orange-400 transition hover:text-orange-300" />,
            title: "Гнучкі фільтри",
            description: "Налаштовуй район, кількість кімнат і бюджет під власні потреби.",
        },
        {
            icon: <Zap className="h-6 w-6 text-orange-400 transition hover:text-orange-300" />,
            title: "Бронювання першим",
            description: "Встигаєш першим зв’язатися з власником та забронювати квартиру.",
        },
        {
            icon: <Clock className="h-6 w-6 text-orange-400 transition hover:text-orange-300" />,
            title: "Цілодобова робота",
            description: "Бот працює 24/7, щоб ти не пропустив жодного оголошення.",
        },
        {
            icon: <RefreshCw className="h-6 w-6 text-orange-400 transition hover:text-orange-300" />,
            title: "Оновлення в реальному часі",
            description: "Моніторинг популярних платформ з оновленнями у реальному часі.",
        },
        {
            icon: <Send className="h-6 w-6 text-orange-400 transition hover:text-orange-300" />,
            title: "У Telegram",
            description: "Отримуй всі сповіщення одразу у Telegram без зайвих застосунків.",
        },
    ];

    return (
        <section
            className="bg-[#0f172a] min-h-screen py-24 sm:py-32 flex flex-col justify-center"
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full">
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-base font-semibold leading-7 text-orange-400">Твої переваги</p>
                    <h2 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                        Знайди квартиру швидше з FoxFlat
                    </h2>
                    <p className="mt-6 text-lg leading-8 text-gray-300">
                        Telegram-бот FoxFlat миттєво повідомляє про нові квартири у Львові та Києві, допомагаючи бронювати житло першим.
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
