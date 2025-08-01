"use client";

export default function AdminHeader() {
    return (
        <header className="flex justify-between items-center mb-6 md:hidden">
            <h2 className="text-xl font-bold text-orange-400">FoxFlat Admin</h2>
            <button className="p-2 rounded hover:bg-orange-500/20 transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </button>
        </header>
    );
}
