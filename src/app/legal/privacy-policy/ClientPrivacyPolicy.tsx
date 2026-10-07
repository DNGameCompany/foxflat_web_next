'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import HeaderFoxFlat from '@/src/components/HeaderFoxFlat';

interface PageData {
    title: string;
    lastUpdated: string;
    supportTelegram: string;
}

interface ClientPrivacyPolicyProps {
    pageData: PageData;
}

export default function ClientPrivacyPolicy({ pageData }: ClientPrivacyPolicyProps) {
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
                            Ця Політика конфіденційності регламентує порядок збору, зберігання, обробки та
                            використання персональних даних Користувачів Telegram-бота FoxFlat (далі – &quot;Бот&quot;,
                            &quot;Ми&quot;, &quot;FoxFlat&quot;). Використовуючи Бот, Користувач (далі – &quot;Ви&quot;, &quot;Користувач&quot;)
                            підтверджує свою згоду з умовами цієї Політики.
                        </p>
                        <p className="mt-2">
                            FoxFlat є сервісом сповіщень про нові оголошення про оренду квартир. Ми не
                            публікуємо оголошення і не зберігаємо їх архів для перегляду.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-orange-400 mb-2">2. Які дані ми збираємо</h2>
                        <p>
                            FoxFlat збирає дані, необхідні для роботи сервісу:
                        </p>
                        <ul className="list-none space-y-1">
                            <li>2.1. user_id – унікальний Telegram ID Користувача.</li>
                            <li>
                                2.2. Фільтри, налаштовані Користувачем у Боті (наприклад, місто, район, ціна,
                                площа, кількість кімнат, поверх).
                            </li>
                            <li>
                                2.3. Дані про використання Бота: статус і строк підписки, ідентифікатори
                                оголошень, які були надіслані або показані Користувачу, оголошення, збережені
                                Користувачем в обрані, кількість переходів на оголошення, стан паузи
                                моніторингу.
                            </li>
                            <li>
                                2.4. Джерело переходу в Бот (наприклад, сторінка, з якої Користувач запустив
                                Бот).
                            </li>
                            <li>
                                2.5. Дані про оплату підписки:
                                <ul className="list-none ml-4 space-y-1">
                                    <li>
                                        2.5.1. дані, які передає платіжний сервіс Rozetka Pay після успішної
                                        транзакції: payment_id, transaction_id, order_id (external_id), status
                                        (стан платежу), amount (сума), currency (валюта), description
                                        (призначення платежу);
                                    </li>
                                    <li>
                                        2.5.2. дані, які формує Бот: user_id (Telegram ID платника), обраний
                                        тариф (тиждень або місяць), дата оплати та дата завершення підписки, а
                                        також службова інформація про продовження підписки (чи це було
                                        продовження, дата завершення попередньої підписки, кількість
                                        перенесених днів).
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <p className="mt-2">
                            Ми не обробляємо дані банківських карток безпосередньо – платежі обробляє
                            платіжний сервіс Rozetka Pay.
                        </p>
                        {/* [ПЕРЕВІР] Звір список полів у 2.5 з тим, що реально передає Rozetka Pay і що ти зберігаєш. */}
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-orange-400 mb-2">3. Мета обробки даних</h2>
                        <p>Зібрані дані використовуються для:</p>
                        <ul className="list-none space-y-1">
                            <li>3.1. надання доступу до функціоналу Бота згідно з обраним тарифом;</li>
                            <li>3.2. надсилання нових оголошень відповідно до обраних фільтрів та уникнення повторів;</li>
                            <li>3.3. підтвердження і перевірки успішної оплати;</li>
                            <li>3.4. підтримки Користувачів та вирішення технічних проблем;</li>
                            <li>3.5. аналітики сервісу та покращення якості послуг.</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-orange-400 mb-2">4. Зберігання даних</h2>
                        <p>
                            Дані зберігаються у хмарних сервісах Firebase (Google Cloud Platform) та в
                            інфраструктурі, що забезпечує роботу Бота (зокрема, база даних Redis для
                            тимчасових даних). Дані можуть оброблятися на серверах, розташованих за межами
                            України. Ми вживаємо технічних і організаційних заходів для захисту інформації від
                            несанкціонованого доступу, втрати чи знищення.
                        </p>
                        {/* [ПЕРЕВІР] Уточни, де фізично розташовані сервери (регіон Firebase, хостинг). */}
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-orange-400 mb-2">5. Термін зберігання</h2>
                        <p>
                            Ваші персональні дані зберігаються протягом дії підписки та до 12 місяців після
                            її завершення, за винятком даних про платежі. Дані про платежі зберігаються
                            стільки, скільки цього вимагає законодавство України. Дані про надіслані
                            оголошення зберігаються тимчасово. У разі видалення Користувача з Бота (зокрема,
                            якщо Користувач заблокував Бот) його дані видаляються з бази даних, за винятком
                            даних про платежі.
                        </p>
                        {/* [ПЕРЕВІР] Звір з кодом hard_delete: які саме колекції видаляються і чи залишаються платежі. */}
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-orange-400 mb-2">6. Права Користувача</h2>
                        <p>Користувач має право:</p>
                        <ul className="list-none space-y-1">
                            <li>6.1. отримати доступ до своїх персональних даних;</li>
                            <li>6.2. вимагати виправлення або видалення даних;</li>
                            <li>6.3. відкликати згоду на обробку персональних даних.</li>
                        </ul>
                        <p>
                            Для реалізації своїх прав Ви можете звернутися через Telegram:{' '}
                            <a
                                href={pageData.supportTelegram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-orange-400 hover:text-orange-300"
                            >
                                @FoxFlatSupport
                            </a>.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-orange-400 mb-2">7. Передача даних третім особам</h2>
                        <p>
                            Ми не продаємо персональні дані. Дані можуть оброблятися сервісами, які
                            забезпечують роботу FoxFlat: Telegram (доставка повідомлень), Google
                            (Firebase), платіжний сервіс Rozetka Pay (обробка платежів), а також
                            передаватися за вимогою законодавства України.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-orange-400 mb-2">8. Cookies</h2>
                        <p>
                            Telegram-бот не використовує cookies. Вся взаємодія з Ботом здійснюється всередині
                            Telegram.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-orange-400 mb-2">9. Зміни до політики</h2>
                        <p>
                            FoxFlat залишає за собою право змінювати цю Політику. Про суттєві зміни ми
                            повідомимо шляхом оновлення цього документа та дати останнього оновлення. Актуальна
                            версія завжди доступна на цій сторінці:{' '}
                            <Link href="/legal/privacy-policy" className="text-orange-400 hover:text-orange-300">
                                foxflat.com.ua/legal/privacy-policy
                            </Link>.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-orange-400 mb-2">10. Контактна інформація</h2>
                        <p>З усіх питань, пов’язаних із цією Політикою, Ви можете звертатися до підтримки в Telegram:</p>
                        <ul className="list-none space-y-1">
                            <li>
                                10.1. Telegram:{' '}
                                <a
                                    href={pageData.supportTelegram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-orange-400 hover:text-orange-300"
                                >
                                    @FoxFlatSupport
                                </a>
                            </li>
                        </ul>
                        <p className="mt-4">
                            🔒 Ми дбаємо про вашу приватність та безпеку даних. Користуючись FoxFlat, Ви
                            погоджуєтеся з умовами цієї Політики конфіденційності.
                        </p>
                    </div>
                </section>
            </motion.section>
        </main>
    );
}