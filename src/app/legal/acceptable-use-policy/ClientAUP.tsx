'use client';

import { motion } from 'framer-motion';
import HeaderFoxFlat from '@/src/components/HeaderFoxFlat';
import FooterFoxFlat from '@/src/components/FooterFoxFlat';

interface PageData {
    title: string;
    description: string;
    lastUpdated: string;
}

interface ClientAUPProps {
    pageData: PageData;
}

export default function ClientAUP({ pageData }: ClientAUPProps) {
    return (
        <main className="relative min-h-screen w-full overflow-hidden bg-black text-white">
            <HeaderFoxFlat />
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 max-w-4xl mx-auto px-6 py-20"
            >
                <h1 className="text-4xl md:text-5xl font-bold text-center text-orange-500 mb-6">
                    {pageData.title}
                </h1>
                <p className="text-neutral-400 text-center mb-12">
                    Останнє оновлення: {pageData.lastUpdated}
                </p>

                <section className="space-y-8 text-neutral-200">
                    <div>
                        <h2 className="text-2xl font-semibold text-orange-400 mb-2">1. Загальні положення</h2>
                        <p>
                            Ця Політика прийнятного використання (далі — «Політика») регламентує правила
                            взаємодії користувача (далі — «Користувач») із Telegram-бота FoxFlat (далі —
                            «Бот»), який надає інформаційні послуги з моніторингу оголошень про оренду квартир.
                        </p>
                        <p>
                            Користуючись Ботом, ви погоджуєтесь із цією Політикою. Якщо ви не погоджуєтесь —
                            припиніть використання сервісу.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-orange-400 mb-2">2. Заборонене використання</h2>
                        <ul className="list-disc list-inside space-y-1">
                            <li>передавати свій Telegram-акаунт або доступ до Бота третім особам;</li>
                            <li>
                                здійснювати автоматизований доступ до Бота (наприклад, через парсери, скрипти,
                                боти, емулятори);
                            </li>
                            <li>
                                копіювати, відтворювати, публікувати або поширювати контент Бота без письмової
                                згоди Виконавця;
                            </li>
                            <li>
                                втручатись у роботу сервісу або намагатися обійти технічні обмеження (наприклад,
                                ліміти безкоштовного плану);
                            </li>
                            <li>використовувати Бот для незаконної, шахрайської або аморальної діяльності;</li>
                            <li>передавати або продавати активну передплату іншим особам.</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-orange-400 mb-2">3. Відповідальність</h2>
                        <ul className="list-disc list-inside space-y-1">
                            <li>
                                У разі порушення цієї Політики, Виконавець залишає за собою право заблокувати
                                доступ до Бота без попередження.
                            </li>
                            <li>
                                Усі кошти, сплачені за підписку, у такому випадку не повертаються і вважаються
                                штрафною санкцією за порушення.
                            </li>
                            <li>
                                Виконавець може видалити дані Користувача без збереження резервної копії.
                            </li>
                            <li>
                                Виконавець залишає за собою право вжити юридичних заходів у межах чинного
                                законодавства України.
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-orange-400 mb-2">4. Зміни до Політики</h2>
                        <p>
                            FoxFlat може змінювати цю Політику без попереднього узгодження з Користувачем.
                            Актуальна версія завжди буде доступна на вимогу або розміщена в Telegram-боті.
                        </p>
                    </div>
                </section>
            </motion.section>
            <FooterFoxFlat />
        </main>
    );
}