'use client';

import { motion } from 'framer-motion';
import HeaderFoxFlat from '@/src/components/HeaderFoxFlat';

interface PageData {
    title: string;
    description: string;
    lastUpdated: string;
    supportTelegram: string;
    offerUrl: string;
    botUrl: string;
    aupUrl: string;
    privacyPolicyUrl: string;
    executorDetails: {
        name: string;
        rnokpp: string;
        bankAccount: string;
    };
}

interface ClientPublicOfferProps {
    pageData: PageData;
}

export default function ClientPublicOffer({ pageData }: ClientPublicOfferProps) {
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
                        <p>
                            Уважно ознайомтеся з текстом цього Договору. Якщо ви не погоджуєтеся з умовами,
                            запропонованими Виконавцем, ви маєте право відмовитися від використання
                            телеграм-бота. Додаткову інформацію можна отримати у службі підтримки
                            через Telegram:{' '}
                            <a href={pageData.supportTelegram} className="text-orange-400 hover:text-orange-300">
                                @FoxFlatSupport
                            </a>.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-orange-400 mb-2">Інформація-підтвердження</h2>
                        <p>
                            Сайт — відкритий для вільного візуального ознайомлення публічно доступний вебсайт{' '}
                            <a href="https://foxflat.com.ua" className="text-orange-400 hover:text-orange-300">
                                foxflat.com.ua
                            </a>, що належить {pageData.executorDetails.name} та через який надаються послуги.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-orange-400 mb-2">Преамбула</h2>
                        <p>
                            Перед використанням телеграм-бота FoxFlat, де розміщені всі матеріали та
                            функціонал, уважно ознайомтеся зі змістом цієї Публічної оферти, зокрема з
                            умовами надання доступу до інформаційних послуг. Цей Договір розміщено у
                            повідомленні перед здійсненням оплати.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-orange-400 mb-2">1. Загальні положення</h2>
                        <ul className="list-none space-y-1">
                            <li>
                                1.1. Цей документ є публічним договором (офертою) {pageData.executorDetails.name},
                                зареєстрованого відповідно до законодавства України (далі — Виконавець), і
                                визначає умови надання доступу до телеграм-бота FoxFlat (далі — Бот).
                            </li>
                            <li>
                                1.2. Відповідно до ст. 633 Цивільного кодексу України цей Договір є публічною
                                офертою, обов&#39;язковою для виконання Виконавцем.
                            </li>
                            <li>
                                1.3. Факт використання Бота, зокрема здійснення оплати, вважається повним і
                                безумовним прийняттям (акцептом) умов цієї оферти.
                            </li>
                            <li>
                                1.4. Оферта діє безстроково до моменту її відкликання або зміни Виконавцем. Про
                                зміни Виконавець повідомляє шляхом публікації оновленого тексту за адресою:{' '}
                                <a href={pageData.offerUrl} className="text-orange-400 hover:text-orange-300">
                                    {pageData.offerUrl}
                                </a>, не пізніше ніж за 7 календарних днів до набрання ними чинності.
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-orange-400 mb-2">2. Термінологія</h2>
                        <ul className="list-none space-y-1">
                            <li>
                                2.1. <strong>Телеграм-бот</strong> — сукупність програмних, інформаційних і
                                медійних даних, доступних за адресою{' '}
                                <a href={pageData.botUrl} className="text-orange-400 hover:text-orange-300">
                                    {pageData.botUrl}
                                </a>, що надаються за платною передплатою.
                            </li>
                            <li>2.2. <strong>Користувач</strong> — фізична особа, яка має доступ до телеграм-бота FoxFlat.</li>
                            <li>
                                2.3. <strong>Замовник</strong> — Користувач, який здійснив успішну оплату та
                                отримав доступ до платного функціоналу Бота.
                            </li>
                            <li>
                                2.4. <strong>Успішна оплата</strong> — зарахування грошової суми, що відповідає
                                вартості обраного тарифного плану, на рахунок Виконавця через платіжну систему
                                RozetkaPay.
                            </li>
                            <li>2.5. <strong>Фінансовий агент</strong> — платіжна система RozetkaPay, яка забезпечує переказ коштів.</li>
                            <li>
                                2.6. <strong>Передплата</strong> — тимчасовий доступ до функціоналу телеграм-бота
                                FoxFlat за щомісячну оплату.
                            </li>
                            <li>2.7. <strong>Тариф</strong> — встановлена Виконавцем вартість і термін дії передплати.</li>
                            <li>2.8. Решта термінів тлумачаться відповідно до законодавства України.</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-orange-400 mb-2">3. Предмет договору</h2>
                        <ul className="list-none space-y-1">
                            <li>
                                3.1. Виконавець надає Замовнику інформаційні послуги у вигляді доступу до
                                функціоналу телеграм-бота FoxFlat (
                                <a href={pageData.botUrl} className="text-orange-400 hover:text-orange-300">
                                    {pageData.botUrl}
                                </a>
                                ) на умовах обраного Тарифу, а Замовник зобов&#39;язується сплатити абонентську
                                плату.
                            </li>
                            <li>
                                3.2. Телеграм-бот FoxFlat призначений для пошуку квартир шляхом аналізу даних із
                                різних платформ.
                            </li>
                            <li>
                                3.3. Інформація про пакети послуг, їхній обсяг і вартість доступна у
                                телеграм-боті до моменту оплати.
                            </li>
                            <li>
                                3.4. Виконавець має право змінювати обсяг послуг і їхню вартість без
                                попереднього повідомлення. Зміни не впливають на вже оплачену передплату.
                            </li>
                            <li>3.5. Замовник здійснює оплату у розмірі вартості обраного тарифного плану.</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-orange-400 mb-2">4. Ціна та порядок розрахунків</h2>
                        <ul className="list-none space-y-1">
                            <li>
                                4.1. Вартість тарифного плану визначається у телеграм-боті на момент акцепту
                                Договору, враховуючи акційні пропозиції.
                            </li>
                            <li>4.2. Оплата здійснюється в безготівковій формі через платіжну систему RozetkaPay.</li>
                            <li>
                                4.3. Оплата можлива лише після ознайомлення з умовами Договору та активації
                                відповідної команди в боті.
                            </li>
                            <li>
                                4.4. Зобов&#39;язання Замовника щодо оплати вважаються виконаними після зарахування
                                повної суми на рахунок Виконавця.
                            </li>
                            <li>
                                4.5. Підтвердження оплати зберігається у вигляді invoice від RozetkaPay. Користувач
                                отримує повідомлення про оплату через бот.
                            </li>
                            <li>
                                4.6. Платіжне підтвердження від RozetkaPay є доказом акцепту Договору та надання
                                послуг.
                            </li>
                            <li>
                                4.7. Сплата вартості передплати свідчить про згоду Замовника з якістю та обсягом
                                послуг.
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-orange-400 mb-2">5. Порядок надання акцепту</h2>
                        <ul className="list-none space-y-1">
                            <li>
                                5.1. Укладати Договір має право особа з повною цивільною дієздатністю. У разі
                                обмеженої дієздатності Договір укладають законні представники.
                            </li>
                            <li>5.2. Укладання Договору відбувається шляхом надання акцепту через успішну оплату.</li>
                            <li>
                                5.3. Моментом акцепту вважається зарахування повної суми оплати на рахунок
                                Виконавця.
                            </li>
                            <li>
                                5.4. Акцепт Договору означає згоду з його умовами та додатками:
                                <ul className="list-none ml-4 space-y-1">
                                    <li>
                                        5.4.1. Політика прийнятного використання (AUP):{' '}
                                        <a href={pageData.aupUrl} className="text-orange-400 hover:text-orange-300">
                                            {pageData.aupUrl}
                                        </a>
                                    </li>
                                    <li>
                                        5.4.2. Політика конфіденційності:{' '}
                                        <a href={pageData.privacyPolicyUrl} className="text-orange-400 hover:text-orange-300">
                                            {pageData.privacyPolicyUrl}
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li>5.5. Замовник не має права використовувати послуги без укладання Договору.</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-orange-400 mb-2">6. Порядок надання послуг</h2>
                        <ul className="list-none space-y-1">
                            <li>
                                6.1. Процедура надання послуг:
                                <ul className="list-none ml-4 space-y-1">
                                    <li>6.1.1. Перед оплатою Користувач отримує посилання на Договір у боті.</li>
                                    <li>6.1.2. Після ознайомлення Користувач переходить на сторінку RozetkaPay для оплати.</li>
                                    <li>6.1.3. Передплата активується автоматично після зарахування оплати.</li>
                                    <li>
                                        6.1.4. Послуги надаються дистанційно через бот. Початком надання вважається
                                        активація передплати.
                                    </li>
                                    <li>6.1.5. Матеріали в боті є авторськими та суб&#39;єктивними.</li>
                                    <li>
                                        6.1.6. Послуги вважаються наданими після повідомлення про активацію передплати.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                6.2. У разі технічних перерв понад 24 години Виконавець відновлює доступ або
                                надає компенсацію.
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-orange-400 mb-2">7. Права та обов&apos;язки сторін</h2>
                        <ul className="list-none space-y-1">
                            <li>
                                7.1. <strong>Замовник має право:</strong>
                                <ul className="list-none ml-4 space-y-1">
                                    <li>7.1.1. Отримувати інформацію про зміст, строки та умови надання послуг.</li>
                                    <li>7.1.2. Звертатися до служби підтримки.</li>
                                </ul>
                            </li>
                            <li>
                                7.2. <strong>Замовник зобов&apos;язаний:</strong>
                                <ul className="list-none ml-4 space-y-1">
                                    <li>7.2.1. Ознайомитися з умовами Договору до акцепту.</li>
                                    <li>7.2.2. Відстежувати зміни умов та терміни передплати.</li>
                                    <li>7.2.3. Не копіювати, не відтворювати та не передавати матеріали бота.</li>
                                    <li>7.2.4. Дотримуватися умов Договору.</li>
                                </ul>
                            </li>
                            <li>
                                7.3. <strong>Виконавець має право:</strong>
                                <ul className="list-none ml-4 space-y-1">
                                    <li>7.3.1. Організовувати надання послуг.</li>
                                    <li>7.3.2. Не надавати послуги без оплати.</li>
                                    <li>7.3.3. Змінювати умови Договору, повідомляючи за 7 днів.</li>
                                    <li>7.3.4. Вимагати підтвердження оплати.</li>
                                    <li>7.3.5. Проводити технічні перерви до 24 годин без компенсації.</li>
                                    <li>7.3.6. Залучати третіх осіб до виконання Договору.</li>
                                    <li>7.3.7. Змінювати тарифи, не впливаючи на оплачені передплати.</li>
                                    <li>7.3.8. Надсилати інформаційні та рекламні повідомлення.</li>
                                    <li>7.3.9. Використовувати відгуки Замовників у рекламі.</li>
                                </ul>
                            </li>
                            <li>
                                7.4. <strong>Виконавець зобов&apos;язаний:</strong>
                                <ul className="list-none ml-4 space-y-1">
                                    <li>7.4.1. Надавати достовірну інформацію про послуги.</li>
                                    <li>7.4.2. Забезпечити доступ до послуг через бот.</li>
                                </ul>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-orange-400 mb-2">8. Попередження про авторське право</h2>
                        <ul className="list-none space-y-1">
                            <li>
                                8.1. Виконавець володіє авторськими правами на телеграм-бот FoxFlat і всі його
                                складові.
                            </li>
                            <li>
                                8.2. Замовнику забороняється копіювати, відтворювати, поширювати чи передавати
                                доступ до матеріалів бота.
                            </li>
                            <li>
                                8.3. У разі порушення Виконавець припиняє доступ без повернення коштів. Сплачена
                                сума вважається компенсацією за порушення. Виконавець може вжити юридичних
                                заходів.
                            </li>
                            <li>8.4. Порушення авторських прав переслідується відповідно до законодавства України.</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-orange-400 mb-2">9. Умови та порядок скасування передплати</h2>
                        <ul className="list-none space-y-1">
                            <li>
                                9.1. Замовник може скасувати передплату, видаливши акаунт через налаштування
                                бота.
                            </li>
                            <li>
                                9.2. Повернення коштів за цифрові послуги, надані негайно, не передбачено (ст. 8
                                Закону України &quot;Про захист прав споживачів&quot;).
                            </li>
                            <li>
                                9.3. Спірні питання щодо якості послуг розглядаються за зверненням через Telegram:{' '}
                                <a href={pageData.supportTelegram} className="text-orange-400 hover:text-orange-300">
                                    @FoxFlatSupport
                                </a>.
                            </li>
                            <li>
                                9.4. Виконавець не відшкодовує кошти за невикористання послуг через причини, що
                                не залежать від нього.
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-orange-400 mb-2">10. Відповідальність</h2>
                        <ul className="list-none space-y-1">
                            <li>
                                10.1. Виконавець не відповідає за невідповідність очікувань Замовника результатам
                                послуг.
                            </li>
                            <li>
                                10.2. Виконавець не несе відповідальності за невиконання зобов&apos;язань через
                                форс-мажор. Сторони повідомляють про такі обставини протягом 5 робочих днів.
                            </li>
                            <li>
                                10.3. Спори вирішуються в судах України за місцем реєстрації Виконавця.
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-orange-400 mb-2">11. Політика прийнятного використання (AUP)</h2>
                        <ul className="list-none space-y-1">
                            <li>11.1. Використання бота регулюється Політикою AUP, яка є частиною Договору.</li>
                            <li>
                                11.2. Замовник зобов&apos;язується не:
                                <ul className="list-none ml-4 space-y-1">
                                    <li>11.2.1. Втручатися в роботу бота.</li>
                                    <li>11.2.2. Здійснювати автоматизований збір даних.</li>
                                    <li>11.2.3. Передавати доступ третім особам.</li>
                                    <li>11.2.4. Використовувати бот для шахрайства чи розсилок.</li>
                                </ul>
                            </li>
                            <li>
                                11.3. Текст AUP доступний за адресою:{' '}
                                <a href={pageData.aupUrl} className="text-orange-400 hover:text-orange-300">
                                    {pageData.aupUrl}
                                </a>.
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-orange-400 mb-2">12. Політика конфіденційності</h2>
                        <ul className="list-none space-y-1">
                            <li>
                                12.1. Виконавець обробляє мінімальний обсяг даних Замовника (user_id, фільтри
                                пошуку, дані про оплату).
                            </li>
                            <li>
                                12.2. Деталі обробки даних викладено в Політиці конфіденційності:{' '}
                                <a href={pageData.privacyPolicyUrl} className="text-orange-400 hover:text-orange-300">
                                    {pageData.privacyPolicyUrl}
                                </a>.
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-orange-400 mb-2">13. Реквізити Виконавця</h2>
                        <p>
                            {pageData.executorDetails.name}
                            <br />
                            РНОКПП: {pageData.executorDetails.rnokpp}
                            <br />
                            Рахунок: {pageData.executorDetails.bankAccount}
                            <br />
                            Telegram:{' '}
                            <a href={pageData.supportTelegram} className="text-orange-400 hover:text-orange-300">
                                @FoxFlatSupport
                            </a>
                        </p>
                    </div>
                </section>
            </motion.section>
        </main>
    );
}