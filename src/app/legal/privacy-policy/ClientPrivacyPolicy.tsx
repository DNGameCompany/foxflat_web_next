'use client';

import { motion } from 'framer-motion';
import HeaderFoxFlat from '@/src/components/HeaderFoxFlat';

interface PageData {
    title: string;
    description: string;
    lastUpdated: string;
    supportTelegram: string;
    supportEmail: string;
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
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-orange-400 mb-2">2. Які дані ми збираємо</h2>
                        <p>
                            FoxFlat збирає лише мінімальний обсяг даних, необхідний для забезпечення роботи
                            сервісу:
                        </p>
                        <ul className="list-none space-y-1">
                            <li>2.1. user_id – унікальний Telegram ID Користувача.</li>
                            <li>
                                2.2. Фільтри пошуку, обрані Користувачем у Боті (наприклад, район, ціна, площа
                                тощо).
                            </li>
                            <li>
                                2.3. Інформація про оплату, передана нам платіжним сервісом Fondy після
                                здійснення транзакції:
                                <ul className="list-none ml-4 space-y-1">
                                    <li>2.3.1. amount (сума),</li>
                                    <li>2.3.2. currency (валюта),</li>
                                    <li>
                                        2.3.3. create_date, end_date (час створення і завершення підписки),
                                    </li>
                                    <li>2.3.4. payment_id, transaction_id, order_id,</li>
                                    <li>2.3.5. status (стан платежу),</li>
                                    <li>2.3.6. user_id (Telegram ID платника).</li>
                                </ul>
                            </li>
                        </ul>
                        <p>
                            Ми не обробляємо банківські картки чи інші чутливі фінансові дані безпосередньо –
                            це виконує платіжна система Fondy, з дотриманням стандартів безпеки PCI DSS.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-orange-400 mb-2">3. Мета обробки даних</h2>
                        <p>Зібрані дані використовуються виключно для:</p>
                        <ul className="list-none space-y-1">
                            <li>3.1. надання доступу до функціоналу бота згідно передплати;</li>
                            <li>3.2. персоналізації результатів пошуку (відповідно до обраних фільтрів);</li>
                            <li>3.3. підтвердження і перевірки успішної оплати;</li>
                            <li>3.4. забезпечення аналітики сервісу та покращення якості послуг.</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-orange-400 mb-2">4. Зберігання даних</h2>
                        <p>
                            Дані зберігаються на захищеному сервері Firebase (Google Cloud Platform). Ми
                            вживаємо технічних і організаційних заходів для захисту інформації від
                            несанкціонованого доступу, втрати чи знищення.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-orange-400 mb-2">5. Термін зберігання</h2>
                        <p>
                            Ваші персональні дані зберігаються протягом дії підписки та до 12 місяців після
                            її завершення. У разі видалення користувача з бота, його дані автоматично
                            видаляються з бази даних.
                        </p>
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
                            <a href={pageData.supportTelegram} className="text-orange-400 hover:text-orange-300">
                                @FoxFlatSupport
                            </a>.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-orange-400 mb-2">7. Передача даних третім особам</h2>
                        <p>
                            Ми не передаємо персональні дані третім особам, окрім випадків, передбачених
                            законодавством України або якщо це необхідно для обробки платежів через Fondy.
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
                            повідомимо шляхом оновлення цього документа. Актуальна версія завжди доступна за
                            запитом через бот або на сайті{' '}
                            <a href="/legal/privacy-policy" className="text-orange-400 hover:text-orange-300">
                                foxflat.com.ua/legal/privacy-policy
                            </a>.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-orange-400 mb-2">10. Контактна інформація</h2>
                        <p>З усіх питань, пов’язаних із цією Політикою, Ви можете звертатися за контактами:</p>
                        <ul className="list-none space-y-1">
                            <li>
                                10.1. Telegram:{' '}
                                <a href={pageData.supportTelegram} className="text-orange-400 hover:text-orange-300">
                                    @FoxFlatSupport
                                </a>
                            </li>
                            <li>
                                10.2. Електронна пошта:{' '}
                                <a href={`mailto:${pageData.supportEmail}`} className="text-orange-400 hover:text-orange-300">
                                    {pageData.supportEmail}
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