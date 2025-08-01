"use client";

import Image from "next/image";

type TabKey = "users" | "messages" | "blogs" | "collages";

interface AdminSidebarProps {
    activeTab: TabKey;
    setActiveTab: (tab: TabKey) => void;
}

const tabs: { key: TabKey; label: string }[] = [
    { key: "users", label: "Користувачі" },
    { key: "messages", label: "Повідомлення" },
    { key: "blogs", label: "Блоги" },
    { key: "collages", label: "Колажі" },
];

export default function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
    return (
        <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-neutral-900/80 backdrop-blur-md text-white md:translate-x-0 transition-transform">
            <div className="p-6 flex flex-col items-center">
                <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden">
                    <Image
                        src="/images/logo.png"
                        alt="FoxFlat"
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 768px) 96px, 96px"
                    />
                </div>
                <h1 className="text-xl font-bold text-orange-400">FoxFlat Admin</h1>
            </div>
            <nav className="flex flex-col p-4 space-y-2">
                {tabs.map(tab => (
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
        </aside>
    );
}
