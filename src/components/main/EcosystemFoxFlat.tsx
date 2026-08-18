"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { event } from "@/lib/gtag";

export default function EcosystemFoxFlat() {
    const handleBotClick = (action: string, label: string) => {
        event({ action, category: "engagement", label });
    };

    return (
        <section className="relative w-full bg-[#1E1E2E] text-white py-24 px-6 overflow-hidden">
            {/* М'яке фонове сяйво */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] pointer-events-none"
                style={{ background: "radial-gradient(ellipse, rgba(255,107,53,0.08) 0%, transparent 65%)" }}
            />

            <div className="relative max-w-6xl mx-auto">
                <div className="max-w-2xl mx-auto text-center mb-16">
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-xs font-extrabold tracking-widest text-[#FF6B35] uppercase mb-3"
                    >
                        Екосистема Fox
                    </motion.p>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="font-extrabold leading-tight mb-4 text-white"
                        style={{
                            fontFamily: "'Unbounded', sans-serif",
                            fontSize: "clamp(26px, 3.5vw, 42px)",
                            letterSpacing: "-1px",
                        }}
                    >
                        Одна зграя — <span className="text-[#FF6B35]">різні полювання</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 }}
                        className="text-white/60 text-base leading-relaxed"
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
                        className="flex flex-col gap-4 p-8 rounded-2xl bg-white/5 border border-[#FF6B35]/60 shadow-xl relative overflow-hidden"
                    >
                        {/* Невеликий внутрішній акцент камери */}
                        <div
                            className="absolute bottom-0 left-0 w-32 h-32 pointer-events-none"
                            style={{ background: "radial-gradient(circle at 0% 100%, rgba(255,107,53,0.12) 0%, transparent 70%)" }}
                        />

                        <div className="flex items-center justify-between">
                            <Image
                                src="/images/avatar_foxflat_bot.jpg"
                                alt="FoxFlat"
                                width={32}
                                height={32}
                                className="w-9 h-9 rounded-xl object-cover border border-[#FF6B35]/30 shadow-sm"
                            />
                            <span className="font-mono text-[10px] font-bold text-[#FF6B35] bg-[#FF6B35]/15 border border-[#FF6B35]/30 rounded-full px-2.5 py-1 uppercase tracking-wider">
                                Ти тут
                            </span>
                        </div>
                        <h3
                            className="font-bold text-white mt-1"
                            style={{ fontFamily: "'Unbounded', sans-serif", fontSize: "18px" }}
                        >
                            FoxFlat
                        </h3>
                        <p className="text-sm text-white/70 leading-relaxed">
                            Моніторинг оголошень оренди квартир — нові варіанти прилітають у Telegram першими.
                        </p>
                        <a
                            href="https://t.me/FoxFlat_bot?start=website_ecosystem"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => handleBotClick("ecosystem_foxflat_click", "Ecosystem section — FoxFlat link")}
                            className="font-mono text-[13px] font-bold text-[#FF6B35] hover:underline no-underline mt-auto pt-2 inline-flex items-center gap-1"
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
                        className="flex flex-col gap-4 p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-[#FF6B35]/40 transition-all duration-300 shadow-lg"
                    >
                        <Image
                            src="/images/avatar_foxhunt_bot.jpg"
                            alt="FoxHunt"
                            width={32}
                            height={32}
                            className="w-9 h-9 rounded-xl object-cover border border-white/10"
                        />
                        <h3
                            className="font-bold text-white mt-1"
                            style={{ fontFamily: "'Unbounded', sans-serif", fontSize: "18px" }}
                        >
                            FoxHunt
                        </h3>
                        <p className="text-sm text-white/60 leading-relaxed">
                            Моніторинг фріланс-проєктів за твоїми категоріями та ключовими словами.
                        </p>
                        <a
                            href="https://t.me/FoxHunts_bot"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => handleBotClick("ecosystem_foxhunt_click", "Ecosystem section — FoxHunt link")}
                            className="font-mono text-[13px] font-semibold text-white/50 hover:text-[#FF6B35] no-underline mt-auto pt-2 transition-colors inline-flex items-center gap-1"
                        >
                            t.me/FoxHunts_bot →
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}