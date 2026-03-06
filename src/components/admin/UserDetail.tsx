// src/components/admin/UserDetail.tsx
"use client";

import { useEffect, useState, JSX } from "react";

interface Timestamp {
    seconds: number;
    nanoseconds?: number;
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
    filters?: Record<string, unknown> | null;
    last_payment?: {
        amount?: number;
        currency?: string;
        status?: string;
        create_date?: string | Timestamp;
    } | null;
    deleted_info?: {
        deleted_at?: string | Timestamp;
        deleted_by?: string;
    } | null;
}

interface UserDetailProps {
    userId: string;
}

export default function UserDetail({ userId }: UserDetailProps) {
    const [user, setUser] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;

        const fetchUserData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`https://api.foxflat.com.ua/users/${userId}`);
                if (!res.ok) throw new Error(res.status === 404 ? "Користувача не знайдено" : `Помилка сервера: ${res.status}`);
                const data = await res.json();
                setUser(data); // всі дані вже тут, включно з filters
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Не вдалося завантажити дані користувача");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    const formatDate = (dateInput?: string | Timestamp) => {
        if (!dateInput) return "—";
        const date = typeof dateInput === "string" ? new Date(dateInput) : new Date(dateInput.seconds * 1000);
        return isNaN(date.getTime()) ? "—" : date.toLocaleString("uk-UA");
    };

    const formatDateOnly = (dateInput?: string | Timestamp) => {
        if (!dateInput) return "—";
        const date = typeof dateInput === "string" ? new Date(dateInput) : new Date(dateInput.seconds * 1000);
        return isNaN(date.getTime()) ? "—" : date.toLocaleDateString("uk-UA");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500 border-opacity-50" />
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="text-center py-12 text-red-400">
                <p className="text-xl">{error || "Користувача не знайдено"}</p>
            </div>
        );
    }

    const hasFilters = user.filters && Object.keys(user.filters).length > 0;

    return (
        <div className="space-y-8 pb-8">
            {/* Основна інформація */}
            <section className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-200">Основна інформація</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InfoItem label="ID" value={user.user_id} mono />
                    <InfoItem label="Дата створення" value={formatDate(user.created_at)} />
                    <InfoItem label="Підписка" value={`${user.subscription_name} ${user.subscription_status ? `(${user.subscription_status})` : ""}`} />
                    <InfoItem label="Закінчення підписки" value={formatDateOnly(user.subscription_end_date)} />
                    <InfoItem label="Поточне місто" value={user.current_geo || "—"} />
                    <InfoItem label="Стан бота" value={user.current_state || "невідомо"} />
                </div>
            </section>

            {/* Джерела парсингу */}
            {(user.flatfy_url || user.dimria_url) && (
                <section className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-200">Джерела парсингу</h2>
                    {user.flatfy_url && <LinkItem label="Flatfy URL" url={user.flatfy_url} />}
                    {user.dimria_url && <LinkItem label="DimRia URL" url={user.dimria_url} />}
                </section>
            )}

            {/* Фільтри */}
            {hasFilters && (
                <section className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-200">Фільтри користувача</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(user.filters!).map(([key, value]) => (
                            <FilterItem key={key} label={key} value={value} />
                        ))}
                    </div>
                </section>
            )}

            {/* Останній платіж */}
            {user.last_payment && (
                <section className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-200">Останній платіж</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InfoItem label="Сума" value={`${user.last_payment.amount ?? "—"} ${user.last_payment.currency ?? ""}`} />
                        <InfoItem label="Статус" value={user.last_payment.status ?? "—"} />
                        <InfoItem label="Дата" value={formatDate(user.last_payment.create_date)} />
                    </div>
                </section>
            )}

            {/* Видалений користувач */}
            {user.deleted_info && (
                <section className="bg-red-900/30 border border-red-700 rounded-xl p-6 shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-red-300">Користувач видалений</h2>
                    <p className="text-gray-300">
                        Видалено: {formatDate(user.deleted_info.deleted_at)}<br />
                        Ким: {user.deleted_info.deleted_by ?? "—"}
                    </p>
                </section>
            )}
        </div>
    );
}

// Компоненти для структурованого відображення
const InfoItem = ({ label, value, mono }: { label: string; value: string; mono?: boolean }) => (
    <div>
        <dt className="text-sm text-gray-400">{label}</dt>
        <dd className={`mt-1 text-gray-200 ${mono ? "font-mono text-lg break-all" : ""}`}>{value}</dd>
    </div>
);

const LinkItem = ({ label, url }: { label: string; url: string }) => (
    <div className="mb-2">
        <dt className="text-sm text-gray-400">{label}</dt>
        <dd className="mt-1 break-all">
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{url}</a>
        </dd>
    </div>
);

const FilterItem = ({ label, value }: { label: string; value: unknown }) => {
    const renderValue = (val: unknown): JSX.Element => {
        if (val === null || val === undefined) return <span className="text-gray-400">—</span>;
        if (Array.isArray(val)) {
            return (
                <ul className="list-disc list-inside text-gray-200">
                    {val.map((item, idx) => <li key={idx}>{renderValue(item)}</li>)}
                </ul>
            );
        }
        if (typeof val === "object") {
            return (
                <div className="pl-4 border-l border-gray-700">
                    {Object.entries(val as Record<string, unknown>).map(([k, v]) => (
                        <div key={k}>
                            <span className="text-gray-400">{k}: </span>
                            {renderValue(v)}
                        </div>
                    ))}
                </div>
            );
        }
        return <span className="text-gray-200">{val.toString()}</span>;
    };

    return (
        <div className="bg-gray-900 rounded p-3">
            <dt className="text-sm text-gray-400">{label}</dt>
            <dd className="mt-1">{renderValue(value)}</dd>
        </div>
    );
};