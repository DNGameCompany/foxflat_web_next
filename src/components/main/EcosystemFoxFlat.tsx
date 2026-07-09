"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { event } from "@/lib/gtag";

export default function EcosystemFoxFlat() {
    const handleBotClick = (action: string, label: string) => {
        event({ action, category: "engagement", label });
    };

    return (
        <section className="relative py-24 px-6 overflow-hidden">
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] pointer-events-none"
                style={{ background: "radial-gradient(ellipse, rgba(249,115,22,0.05) 0%, transparent 65%)" }}
            />

            <div className="relative max-w-6xl mx-auto">
                <div className="max-w-2xl mx-auto text-center mb-16">
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-xs font-bold tracking-widest text-orange-500 uppercase mb-4"
                    >
                        Екосистема Fox
                    </motion.p>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="font-black leading-tight mb-5"
                        style={{
                            fontFamily: "'Unbounded', sans-serif",
                            fontSize: "clamp(26px, 3.5vw, 42px)",
                            letterSpacing: "-1px",
                        }}
                    >
                        Одна зграя — <span className="text-orange-500">різні полювання</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 }}
                        className="text-white/40 text-base leading-relaxed"
                    >
                        FoxFlat — частина родини Fox: боти, які моніторять те, що важливо саме тобі.
                    </motion.p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    {/* FoxFlat — тут ти */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45 }}
                        className="flex flex-col gap-3.5 p-7 rounded-2xl bg-white/[0.02] border border-orange-500/40"
                    >
                        <div className="flex items-center justify-between">
                            <Image
                                src="/images/avatar_foxflat_bot.jpg"
                                alt="FoxFlat"
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-lg object-cover"
                            />
                            <span className="font-mono text-[10px] font-medium text-orange-400 border border-orange-500/40 rounded-full px-2 py-[3px] uppercase tracking-wide">
                                Ти тут
                            </span>
                        </div>
                        <h3
                            className="font-bold text-white"
                            style={{ fontFamily: "'Unbounded', sans-serif", fontSize: "17px" }}
                        >
                            FoxFlat
                        </h3>
                        <p className="text-sm text-white/50 leading-relaxed">
                            Моніторинг оголошень оренди квартир — нові варіанти прилітають у Telegram першими.
                        </p>
                        <a
                            href="https://t.me/FoxFlat_bot?start=website_ecosystem"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => handleBotClick("ecosystem_foxflat_click", "Ecosystem section — FoxFlat link")}
                            className="font-mono text-[13px] font-medium text-orange-400 no-underline mt-auto"
                        >
                            t.me/FoxFlat_bot →
                        </a>
                    </motion.div>

                    {/* FoxHunt */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45, delay: 0.08 }}
                        className="flex flex-col gap-3.5 p-7 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-orange-500/30 transition-colors"
                    >
                        <Image
                            src="/images/avatar_foxhunt_bot.jpg"
                            alt="FoxHunt"
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-lg object-cover"
                        />
                        <h3
                            className="font-bold text-white"
                            style={{ fontFamily: "'Unbounded', sans-serif", fontSize: "17px" }}
                        >
                            FoxHunt
                        </h3>
                        <p className="text-sm text-white/50 leading-relaxed">
                            Моніторинг фріланс-проєктів за твоїми категоріями та ключовими словами.
                        </p>
                        <a
                            href="https://t.me/FoxHunts_bot"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => handleBotClick("ecosystem_foxhunt_click", "Ecosystem section — FoxHunt link")}
                            className="font-mono text-[13px] font-medium text-white/70 hover:text-orange-400 no-underline mt-auto transition-colors"
                        >
                            t.me/FoxHunts_bot →
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
