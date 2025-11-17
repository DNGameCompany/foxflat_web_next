"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import AnimatedBackground from "@/src/components/AnimatedBackground";
import AdminSidebar from "@/src/components/admin/AdminSidebar";
import AdminDashboard from "@/src/components/admin/AdminDashboard";
import Image from "next/image";

// Тип вкладок
export type TabKey = "users" | "messages" | "blogs" | "collages" | "stats";

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<TabKey>("users");
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const un = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push("/admin/login");
            } else {
                setLoading(false);
            }
        });
        return () => un();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center relative">
                <AnimatedBackground />
                <div className="z-10 flex flex-col items-center space-y-4">
                    <div className="relative w-20 h-20 animate-pulse">
                        <Image
                            src="/images/logo.png"
                            alt="FoxFlat"
                            fill
                            className="object-contain rounded-full"
                        />
                    </div>
                    <p className="text-lg font-semibold text-orange-400 animate-pulse">
                        Завантаження...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black relative text-white">
            <AnimatedBackground />

            {/* Кнопка бургер */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-3 bg-neutral-900/80 rounded-xl backdrop-blur-lg
                           flex items-center justify-center transition active:scale-95"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                <div className="space-y-1.5">
                    <span
                        className={`block h-0.5 w-6 bg-white transition-transform duration-300
                            ${sidebarOpen ? "translate-y-2 rotate-45" : ""}`}
                    />
                    <span
                        className={`block h-0.5 w-6 bg-white transition-opacity duration-300
                            ${sidebarOpen ? "opacity-0" : "opacity-100"}`}
                    />
                    <span
                        className={`block h-0.5 w-6 bg-white transition-transform duration-300
                            ${sidebarOpen ? "-translate-y-2 -rotate-45" : ""}`}
                    />
                </div>
            </button>

            <div className="relative z-10 flex flex-col md:flex-row">
                <AdminSidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isOpen={sidebarOpen}
                    setIsOpen={setSidebarOpen}
                />

                <main className="flex-1 p-6 md:p-8 ml-0 md:ml-64 overflow-auto">
                    <AdminDashboard activeTab={activeTab} />
                </main>
            </div>
        </div>
    );
}
