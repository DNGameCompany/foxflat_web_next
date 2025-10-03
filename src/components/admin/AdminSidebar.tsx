"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";

type TabKey = "users" | "messages" | "blogs" | "collages" | "stats";

interface AdminSidebarProps {
    activeTab: TabKey;
    setActiveTab: (tab: TabKey) => void;
}

const tabs: { key: TabKey; label: string }[] = [
    { key: "users", label: "Користувачі" },
    { key: "messages", label: "Повідомлення" },
    { key: "blogs", label: "Блоги" },
    { key: "collages", label: "Колажі" },
    { key: "stats", label: "Статистика" },
];

export default function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            window.location.href = "/admin/login";
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    if (!isMounted) return null;

    return (
        <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-neutral-900/80 backdrop-blur-md text-white md:translate-x-0 transition-transform flex flex-col justify-between">
            <div>
                <div className="p-6 flex flex-col items-center">
                    <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden">
                        <Image
                            src="/images/logo.png"
                            alt="FoxFlat"
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="96px"
                        />
                    </div>
                    <h1 className="text-xl font-bold text-orange-400 mb-2">FoxFlat Admin</h1>
                    <Link href="/" className="text-sm text-gray-400 hover:text-orange-300 transition">
                        На головну
                    </Link>
                </div>

                <nav className="flex flex-col p-4 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`text-left py-2 px-4 rounded transition
                                ${activeTab === tab.key ? "bg-orange-500/30" : "hover:bg-orange-500/20"}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="p-4 border-t border-neutral-800">
                <button
                    onClick={handleLogout}
                    className="w-full text-left py-2 px-4 rounded text-red-400 hover:bg-red-500/20 transition"
                >
                    Вийти з акаунту
                </button>
            </div>
        </aside>
    );
}
