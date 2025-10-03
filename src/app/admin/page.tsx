"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";  // Імпорт auth звідси
import AnimatedBackground from "@/src/components/AnimatedBackground";
import AdminSidebar from "@/src/components/admin/AdminSidebar";
import AdminDashboard from "@/src/components/admin/AdminDashboard";
import Image from "next/image";

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<"users" | "messages" | "blogs" | "collages" | "stats">("users");
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push("/admin/login");
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribe();
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
                            priority
                        />
                    </div>
                    <p className="text-lg font-semibold text-orange-400 animate-pulse">
                        Завантаження....
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black relative text-white">
            <AnimatedBackground />
            <div className="relative z-10 flex flex-col md:flex-row">
                <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                <main className="flex-1 p-6 md:p-8 ml-0 md:ml-64 overflow-auto">
                    <AdminDashboard activeTab={activeTab} />
                </main>
            </div>
        </div>
    );
}
