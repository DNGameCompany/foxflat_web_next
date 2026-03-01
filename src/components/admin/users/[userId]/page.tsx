"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Timestamp {
    seconds: number;
    nanoseconds?: number;
}

interface PaymentInfo {
    user_id?: string;
    payment_id?: string;
    order_id?: string;
    status?: string;
    amount?: number;
    currency?: string;
    description?: string;
    create_date?: string | Timestamp;
    end_date?: string | Timestamp;
    transaction_id?: string;
}

interface DeletedInfo {
    user_id?: string;
    deleted_at?: string | Timestamp;
    deleted_by?: string;
    subscription?: string;
    filters?: Record<string, unknown>;
}

interface Filters {
    [key: string]: unknown;
}

interface UserDetails {
    user_id: string;
    created_at?: string | Timestamp;
    subscription_status?: string;
    subscription_name?: string;
    subscription_end_date?: string | Timestamp;
    current_geo?: string;
    current_state?: string;
    flatfy_url?: string | null;
    dimria_url?: string | null;
    filters?: Filters | null;
    last_payment?: PaymentInfo | null;
    deleted_info?: DeletedInfo | null;
}

export default function UserDetailPage() {
    const { userId } = useParams<{ userId: string }>();
    const router = useRouter();

    const [user, setUser] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;

        const fetchUser = async () => {
            try {
                setLoading(true);
                const res = await fetch(`https://api.foxflat.com.ua/users/${userId}`, {
                    headers: {
                        // "Authorization": `Bearer ${token}`, // якщо є авторизація
                    },
                });

                if (!res.ok) {
                    if (res.status === 404) {
                        throw new Error("Користувача не знайдено");
                    }
                    throw new Error(`Помилка сервера: ${res.status}`);
                }

                const data = await res.json();

                setUser({
                    user_id: data.user_id || userId,
                    created_at: data.created_at,
                    subscription_status: data.subscription_status,
                    subscription_name: data.subscription_name || data.active_subscription?.sub_name || "немає",
                    subscription_end_date: data.subscription_end_date,
                    current_geo: data.current_geo,
                    current_state: data.current_state,
                    flatfy_url: data.flatfy_url,
                    dimria_url: data.dimria_url,
                    filters: data.filters,
                    last_payment: data.last_payment,
                    deleted_info: data.deleted_info,
                });
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : "Не вдалося завантажити дані користувача";
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50"></div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="text-center py-12 text-red-400">
                <p className="text-xl">{error || "Користувача не знайдено"}</p>
                <button
                    onClick={() => router.back()}
                    className="mt-8 px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                >
                    ← Повернутися до списку
                </button>
            </div>
        );
    }

    const formatDate = (dateInput: string | Timestamp | undefined): string => {
        if (!dateInput) return "—";
        let date: Date;
        if (typeof dateInput === "string") {
            date = new Date(dateInput);
        } else {
            date = new Date(dateInput.seconds * 1000);
        }
        return date.toLocaleString("uk-UA");
    };

    const formatDateOnly = (dateInput: string | Timestamp | undefined): string => {
        if (!dateInput) return "—";
        let date: Date;
        if (typeof dateInput === "string") {
            date = new Date(dateInput);
        } else {
            date = new Date(dateInput.seconds * 1000);
        }
        return date.toLocaleDateString("uk-UA");
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-12">
            {/* Заголовок */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold text-gray-100">
                    Користувач <span className="font-mono text-blue-400">{user.user_id}</span>
                </h1>
                <button
                    onClick={() => router.back()}
                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                >
                    ← Назад
                </button>
            </div>

            {/* Основна інформація */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-6 text-gray-200">Основна інформація</h2>
                <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
                    <div>
                        <dt className="text-sm text-gray-400">ID</dt>
                        <dd className="mt-1 font-mono text-lg text-gray-100 break-all">{user.user_id}</dd>
                    </div>

                    <div>
                        <dt className="text-sm text-gray-400">Дата створення</dt>
                        <dd className="mt-1 text-gray-200">
                            {formatDate(user.created_at)}
                        </dd>
                    </div>

                    <div>
                        <dt className="text-sm text-gray-400">Підписка</dt>
                        <dd className="mt-1 text-lg font-medium text-gray-100">
                            {user.subscription_name || "немає"}
                            {user.subscription_status && ` (${user.subscription_status})`}
                        </dd>
                    </div>

                    {user.subscription_end_date && (
                        <div>
                            <dt className="text-sm text-gray-400">Закінчення підписки</dt>
                            <dd className="mt-1 text-gray-200">
                                {formatDateOnly(user.subscription_end_date)}
                            </dd>
                        </div>
                    )}

                    <div>
                        <dt className="text-sm text-gray-400">Поточне місто</dt>
                        <dd className="mt-1 text-gray-200">{user.current_geo || "—"}</dd>
                    </div>

                    <div>
                        <dt className="text-sm text-gray-400">Стан бота</dt>
                        <dd className="mt-1 text-gray-200">{user.current_state || "невідомо"}</dd>
                    </div>
                </dl>
            </div>

            {/* Джерела парсингу */}
            {(user.flatfy_url || user.dimria_url) && (
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-200">Джерела парсингу</h2>
                    <div className="space-y-4">
                        {user.flatfy_url && (
                            <div>
                                <dt className="text-sm text-gray-400">Flatfy URL</dt>
                                <dd className="mt-1 break-all text-blue-400 hover:underline">
                                    <a href={user.flatfy_url} target="_blank" rel="noopener noreferrer">
                                        {user.flatfy_url}
                                    </a>
                                </dd>
                            </div>
                        )}
                        {user.dimria_url && (
                            <div>
                                <dt className="text-sm text-gray-400">DimRia URL</dt>
                                <dd className="mt-1 break-all text-blue-400 hover:underline">
                                    <a href={user.dimria_url} target="_blank" rel="noopener noreferrer">
                                        {user.dimria_url}
                                    </a>
                                </dd>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Фільтри (якщо є) */}
            {user.filters && Object.keys(user.filters).length > 0 && (
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-200">Фільтри користувача</h2>
                    <pre className="bg-gray-900 p-4 rounded text-sm text-gray-300 overflow-auto">
            {JSON.stringify(user.filters, null, 2)}
          </pre>
                </div>
            )}

            {/* Останній платіж */}
            {user.last_payment && (
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-200">Останній платіж</h2>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <dt className="text-sm text-gray-400">Сума</dt>
                            <dd className="text-gray-100">{user.last_payment.amount ?? "—"} {user.last_payment.currency ?? ""}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-gray-400">Статус</dt>
                            <dd className="text-gray-100">{user.last_payment.status ?? "—"}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-gray-400">Дата</dt>
                            <dd className="text-gray-100">
                                {user.last_payment.create_date ? formatDate(user.last_payment.create_date) : "—"}
                            </dd>
                        </div>
                    </dl>
                </div>
            )}

            {/* Якщо користувач видалений */}
            {user.deleted_info && (
                <div className="bg-red-900/30 border border-red-700 rounded-xl p-6 shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-red-300">Користувач видалений</h2>
                    <p className="text-gray-300">
                        Видалено: {user.deleted_info.deleted_at ? formatDate(user.deleted_info.deleted_at) : "—"}
                        <br />
                        Ким: {user.deleted_info.deleted_by ?? "—"}
                    </p>
                </div>
            )}
        </div>
    );
}