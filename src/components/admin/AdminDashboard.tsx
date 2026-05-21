"use client";

import UserTab from "@/src/components/admin/UserTab";         // ← правильний компонент
import MessageTab from "@/src/components/admin/MessageTab";
import StatsTab from "@/src/components/admin/Stats/Stats";
import TGChannelSection from "@/src/components/admin/TGChannelSection";
import BlogTab from "@/src/components/admin/Blog/BlogTab";
import SystemTab from "@/src/components/admin/SystemTab";

interface AdminDashboardProps {
    activeTab: "users" | "messages" | "blogs" | "stats" | "channel" | "system";
}

export default function AdminDashboard({ activeTab }: AdminDashboardProps) {
    return (
        <div className="space-y-6">
            {activeTab === "users" && (
                <section className="bg-neutral-900/70 backdrop-blur-md border border-orange-500/20 rounded-xl p-6">
                    <UserTab />           {/* ← тепер тут правильний компонент */}
                </section>
            )}

            {activeTab === "messages" && (
                <section className="bg-neutral-900/70 backdrop-blur-md border border-orange-500/20 rounded-xl p-6">
                    <h3 className="text-2xl font-bold text-orange-400 mb-4">Надіслати повідомлення</h3>
                    <MessageTab />
                </section>
            )}

            {activeTab === "blogs" && (
                <section className="bg-neutral-900/70 backdrop-blur-md border border-orange-500/20 rounded-xl p-6">
                    <h3 className="text-2xl font-bold text-orange-400 mb-4">Керування блогами</h3>
                    <BlogTab />
                </section>
            )}


            {activeTab === "stats" && (
                <section className="bg-neutral-900/70 backdrop-blur-md border border-orange-500/20 rounded-xl p-6">
                    <h3 className="text-2xl font-bold text-orange-400 mb-4">Статистика</h3>
                    <StatsTab />
                </section>
            )}

            {activeTab === "channel" && (
                <section className="bg-neutral-900/70 backdrop-blur-md border border-orange-500/20 rounded-xl p-6">
                    <h3 className="text-2xl font-bold text-orange-400 mb-4">Телеграм канал</h3>
                    <TGChannelSection />
                </section>
            )}


            {activeTab === "system" && (
                <section className="bg-neutral-900/70 backdrop-blur-md border border-orange-500/20 rounded-xl p-6">
                    <h3 className="text-2xl font-bold text-orange-400 mb-4">System</h3>
                    <SystemTab />
                </section>
            )}
        </div>
    );
}