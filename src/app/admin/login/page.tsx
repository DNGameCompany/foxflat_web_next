"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AnimatedBackground from "@/src/components/AnimatedBackground";
import Image from "next/image";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const auth = getAuth();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/admin");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Помилка авторизації");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
            <AnimatedBackground />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-sm bg-neutral-900/50 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-neutral-800"
            >
                <div className="flex justify-center mb-6">
                    <Image
                        src="/images/logo.png"
                        alt="FoxFlat Admin"
                        width={80}
                        height={80}
                        className="rounded-full"
                    />
                </div>
                <h1 className="text-center text-2xl font-bold text-white mb-6">FoxFlat Admin</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-md bg-neutral-800 border border-neutral-700 text-white p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Пароль</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-md bg-neutral-800 border border-neutral-700 text-white p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
                            placeholder="Ваш пароль"
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm mt-1">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full rounded-md bg-gradient-to-r from-orange-500 to-orange-400 text-black font-semibold py-3 mt-2 transition ${
                            loading ? "opacity-50 cursor-not-allowed" : "hover:from-orange-400 hover:to-orange-300"
                        }`}
                    >
                        {loading ? "Завантаження..." : "Увійти"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
