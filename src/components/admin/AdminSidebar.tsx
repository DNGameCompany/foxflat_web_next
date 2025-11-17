"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { TabKey } from "@/src/app/admin/page";

interface AdminSidebarProps {
    activeTab: TabKey;
    setActiveTab: (tab: TabKey) => void;
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
}

const tabs: { key: TabKey; label: string }[] = [
    { key: "users", label: "Користувачі" },
    { key: "messages", label: "Повідомлення" },
    { key: "blogs", label: "Блоги" },
    { key: "collages", label: "Колажі" },
    { key: "stats", label: "Статистика" },
];

export default function AdminSidebar({ activeTab, setActiveTab, isOpen, setIsOpen }: AdminSidebarProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    const closeMenu = () => setIsOpen(false);

    const handleLogout = async () => {
        await signOut(auth);
        window.location.href = "/admin/login";
    };

    return (
        <>
            {/* Overlay — закриває по кліку */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden transition-opacity
                    ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={closeMenu}
            />

            <aside
                className={`
                    fixed inset-y-0 left-0 z-40 w-64 bg-neutral-900/90 backdrop-blur-md text-white 
                    transition-transform flex flex-col justify-between
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    md:translate-x-0
                `}
            >
                <div>
                    <div className="p-6 flex flex-col items-center">
                        <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden">
                            <Image
                                src="/images/logo.png"
                                alt="FoxFlat"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <h1 className="text-xl font-bold text-orange-400 mb-2">FoxFlat Admin</h1>
                        <Link
                            href="/"
                            className="text-sm text-gray-400 hover:text-orange-300 transition"
                            onClick={closeMenu}
                        >
                            На головну
                        </Link>
                    </div>

                    <nav className="flex flex-col p-4 space-y-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => {
                                    setActiveTab(tab.key);
                                    closeMenu();
                                }}
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
                        onClick={() => {
                            handleLogout();
                            closeMenu();
                        }}
                        className="w-full text-left py-2 px-4 rounded text-red-400 hover:bg-red-500/20 transition"
                    >
                        Вийти з акаунту
                    </button>
                </div>
            </aside>
        </>
    );
}
