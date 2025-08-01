"use client";
import UserTable from "@/src/components/admin/UserTable";
import MessageTab from "@/src/components/admin/MessageTab";
import BlogsTab from "@/src/components/admin/Blogs";

interface AdminDashboardProps {
    activeTab: "users" | "messages" | "blogs" | "collages";
}

export default function AdminDashboard({ activeTab }: AdminDashboardProps) {
    return (
        <div className="space-y-6">
            {activeTab === "users" && (
                <section className="bg-neutral-900/70 backdrop-blur-md border border-orange-500/20 rounded-xl p-6">
                    <UserTable />
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
                    <BlogsTab />
                </section>
            )}

            {activeTab === "collages" && (
                <section className="bg-neutral-900/70 backdrop-blur-md border border-orange-500/20 rounded-xl p-6">
                    <h3 className="text-2xl font-bold text-orange-400 mb-4">Генерація колажів</h3>
                    {/* Тут генератор колажів */}
                    <p className="text-neutral-300">Тут буде форма генерації колажів.</p>
                </section>
            )}
        </div>
    );
}
