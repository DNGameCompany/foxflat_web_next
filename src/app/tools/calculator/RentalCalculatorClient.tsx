"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { jsPDF } from "jspdf";
import HeaderFoxFlat from "@/src/components/HeaderFoxFlat";

const CATEGORY_CONFIG = {
    tips:  { label: "Поради",  color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
    news:  { label: "Новини",  color: "text-purple-400 bg-purple-400/10 border-purple-400/20" },
    guide: { label: "Гайд",    color: "text-green-400 bg-green-400/10 border-green-400/20" },
} as const;

interface BlogPost {
    slug: string;
    title: string;
    category: keyof typeof CATEGORY_CONFIG;
    created_at: string;
    read_time: number;
    cover_image?: string;
}

interface SliderField {
    id: string;
    label: string;
    min: number;
    max: number;
    step: number;
    unit: string;
    defaultValue: number;
    hint?: string;
}

interface MoveInRow {
    label: string;
    val: number;
}

const FIELDS: SliderField[] = [
    { id: "rent",       label: "Орендна плата",         min: 2000,  max: 50000, step: 100, unit: "грн", defaultValue: 12000, hint: "Ціна з оголошення" },
    { id: "electric",   label: "Електроенергія",         min: 0,     max: 3000,  step: 10,  unit: "грн", defaultValue: 600,   hint: "~100–300 кВт·год" },
    { id: "gas",        label: "Газ",                    min: 0,     max: 2000,  step: 10,  unit: "грн", defaultValue: 300,   hint: "Якщо є газ" },
    { id: "water",      label: "Вода",                   min: 0,     max: 1000,  step: 10,  unit: "грн", defaultValue: 200,   hint: "Холодна + гаряча" },
    { id: "building",   label: "Обслуговування будинку", min: 0,     max: 2000,  step: 10,  unit: "грн", defaultValue: 400,   hint: "ОСББ / ЖЕК" },
    { id: "internet",   label: "Інтернет + TV",          min: 0,     max: 600,   step: 10,  unit: "грн", defaultValue: 200,   hint: "" },
];

const DEPOSIT_MULTIPLIER = [{ label: "1 місяць", value: 1 }, { label: "2 місяці", value: 2 }, { label: "3 місяці", value: 3 }];
const AGENT_FEE = [{ label: "Без комісії", value: 0 }, { label: "50%", value: 0.5 }, { label: "100%", value: 1 }];
const SEGMENT_COLORS = ["bg-orange-500", "bg-blue-500", "bg-purple-500", "bg-green-500", "bg-yellow-500", "bg-pink-500"];

const faqs = [
    {
        q: "Як точно розрахувати вартість оренди квартири на місяць?",
        a: "Щоб отримати точну суму, додайте до вказаної в оголошенні ціни оренди витрати на комунальні послуги (світло, вода, газ, опалення), обслуговування будинку (ЖЕК/ОСББ) та інтернет. Наш калькулятор автоматично підсумовує ці параметри, показуючи реальне навантаження на ваш бюджет.",
    },
    {
        q: "Скільки грошей потрібно мати при заселенні в квартиру?",
        a: "Зазвичай у первый день підписання договору необхідно сплатити вартість першого місяця оренди, страхову заставу (депозит, який найчастіше дорівнює ціні одного місяця) та комісію рієлтора (якщо об'єкт здається через посередника — зазвичай 50% або 100%). Калькулятор виводить цю фінальну суму в блоці «Потрібно мати».",
    },
    {
        q: "Навіщо потрібна страхова застава (депозит) і чи повертається вона?",
        a: "Страхова застава захищає власника від можливих матеріальних збитків, пошкодження техніки чи меблів, або раптового з'їзду мешканців без попередження за місяць. Ці гроші зберігаються у власника до кінця терміну оренди і повертаються вам повністю під час виїзду, якщо майно в порядку.",
    },
    {
        q: "Чому комунальні послуги взимку та влітку так сильно відрізняються?",
        a: "Головна причина — опалення, яке в зимовий період може становити від 1500 до 4500+ грн залежно від площі квартири, типу будинку (старий фонд чи новобудова) та наявності лічильника на тепло. Також влітку витрати на електроенергію можуть зростати через активну роботу кондиціонерів.",
    },
    {
        q: "Хто має платити за обслуговування будинку (ОСББ/ЖЕК) та капітальний ремонт?",
        a: "Згідно з ринковою практикою в Україні, поточні витрати (ОСББ, консьєрж, вивіз сміття, прибирання території) оплачує орендар, оскільки він безпосередньо користується цими послугами. Проте внески у фонд капітального ремонту будинку або заміну ліфтів має сплачувати виключно власник квартири.",
    },
    {
        q: "Як зафіксувати ціну оренди в договорі, щоб її не підняли через місяць?",
        a: "У договорі оренди обов'язково має бути пункт про те, що зазначена вартість є фіксованою на певний термін (зазвичай на 6 або 11 місяців). Також пропишіть умову, що зміна вартості можлива лише за згодою сторін і з письмовим попередженням не менше ніж за 30 днів.",
    },
    {
        q: "Що робити, якщо в орендованій квартирі зламався холодильник чи пральна машина?",
        a: "Якщо поломка сталася через природний знос техніки (вона була стара або вийшла з ладу плата), ремонт або заміну оплачує власник. Якщо ж поломка сталася з вини орендаря (наприклад, механічне пошкодження), ремонт здійснюється за кошт мешканця. Обов'язково фіксуйте стан техніки в акті прийому-передачі.",
    },
    {
        q: "Чи входять лічильники у фіксовану вартість комунальних послуг?",
        a: "Ні, показники лічильників (світло, холодна та гаряча вода, газ) розраховуються щомісяця індивідуально на основі вашого фактичного споживання. Дані у калькуляторі є середньостатистичними для швидкого планування, але їх варто коригувати під свої звички.",
    },
    {
        q: "Як перевірити реальні витрати на комуналку перед підписанням договору?",
        a: "Найкращий спосіб — попросити власника квартири показати оригінальні квитанції за минулий рік. Подивіться платіжку за січень (пік опалювального сезону) та за будь-який літній місяць. Це застрахує вас від прихованих боргів та занадто високих тарифів.",
    },
];

function fmt(n: number) {
    return new Intl.NumberFormat("uk-UA").format(Math.round(n));
}

function FaqItem({ item, index }: { item: typeof faqs[0]; index: number }) {
    const [open, setOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className={`border rounded-xl overflow-hidden transition-colors duration-200 ${
                open ? "border-orange-500/30 bg-orange-500/[0.04]" : "border-white/[0.06] bg-white/[0.02] hover:border-white/10"
            }`}
        >
            <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left">
                <span className={`text-sm font-semibold leading-snug transition-colors ${open ? "text-orange-400" : "text-white"}`} style={{ fontFamily: "'Unbounded', sans-serif", fontSize: "13px" }}>
                    {item.q}
                </span>
                <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${open ? "bg-orange-500 text-black rotate-45" : "bg-white/[0.06] text-white/40"}`}>
                    +
                </span>
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div key="content" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}>
                        <p className="px-6 pb-5 text-xs sm:text-sm text-white/50 leading-relaxed">{item.a}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function AnimatedNumber({ value, className, style }: { value: number; className?: string; style?: React.CSSProperties }) {
    const [display, setDisplay] = useState(value);
    const prevRef = useRef(value);

    useEffect(() => {
        const from = prevRef.current; const to = value; prevRef.current = value;
        if (from === to) return;
        const steps = 12; let i = 0;
        const timer = setInterval(() => {
            i++; const progress = i / steps; const ease = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(from + (to - from) * ease));
            if (i >= steps) { clearInterval(timer); setDisplay(to); }
        }, 16);
        return () => clearInterval(timer);
    }, [value]);

    return <span className={className} style={style}>{fmt(display)}</span>;
}

function Slider({ field, value, onChange }: { field: SliderField; value: number; onChange: (v: number) => void }) {
    const pct = ((value - field.min) / (field.max - field.min)) * 100;
    return (
        <div className="space-y-1.5 relative select-none">
            <div className="flex items-baseline justify-between gap-2">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2">
                    <span className="text-sm font-bold text-white/70">{field.label}</span>
                    {field.hint && <span className="text-xs text-white/30">{field.hint}</span>}
                </div>
                <div className="flex items-baseline gap-1 shrink-0">
                    <span className="text-base font-bold text-white tabular-nums">{fmt(value)}</span>
                    <span className="text-xs text-white/40">{field.unit}</span>
                </div>
            </div>
            <div className="relative py-2 group cursor-pointer">
                <div className="h-2 rounded-full bg-white/[0.06] w-full overflow-hidden relative">
                    <div className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-orange-600 to-orange-400" style={{ width: `${pct}%` }} />
                </div>
                <input type="range" min={field.min} max={field.max} step={field.step} value={value} onChange={e => onChange(Number(e.target.value))} className="absolute inset-0 w-full opacity-0 cursor-pointer h-full z-10" style={{ WebkitAppearance: "none" }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white shadow-[0_0_0_3px_rgba(249,115,22,0.5)] pointer-events-none z-0 transition-transform duration-100 group-hover:scale-110" style={{ left: `calc(${pct}% - 10px)` }} />
            </div>
        </div>
    );
}

function ToggleGroup<T extends number>({ options, value, onChange }: { options: { label: string; value: T }[]; value: T; onChange: (v: T) => void }) {
    return (
        <div className="flex gap-2">
            {options.map(opt => (
                <button key={opt.value} onClick={() => onChange(opt.value)} className={`flex-1 text-xs sm:text-sm font-bold py-3 px-2 rounded-xl border transition-all duration-150 ${value === opt.value ? "bg-orange-500/15 border-orange-500/40 text-orange-400" : "border-white/[0.07] text-white/40 hover:text-white/60"}`}>
                    {opt.label}
                </button>
            ))}
        </div>
    );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <div className={`rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 ${className}`}>{children}</div>;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return <p className="text-xs font-bold tracking-wider text-white/30 uppercase mb-3">{children}</p>;
}

export default function RentalCalculatorClient({ initialPosts }: { initialPosts: BlogPost[] }) {
    const [values, setValues] = useState<Record<string, number>>(Object.fromEntries(FIELDS.map(f => [f.id, f.defaultValue])));
    const [depositMul, setDepositMul] = useState(1);
    const [agentFee, setAgentFee] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);

    const monthly  = Object.values(values).reduce((a, b) => a + b, 0);
    const deposit  = values.rent * depositMul;
    const agent    = values.rent * agentFee;
    const moveIn   = deposit + agent + values.rent;
    const overpay  = monthly - values.rent;
    const overpayPct = values.rent > 0 ? ((overpay / values.rent) * 100).toFixed(0) : "0";

    const segments = FIELDS.map((f, i) => ({
        id: f.id,
        label: f.label,
        value: values[f.id],
        pct: monthly > 0 ? (values[f.id] / monthly) * 100 : 0,
        color: SEGMENT_COLORS[i],
    }));

    const moveInRows: MoveInRow[] = [
        { label: "Перший місяць", val: values.rent },
        { label: "Застава", val: deposit },
        { label: "Комісія рієлтора", val: agent }
    ];

    const handleDownloadPDF = async () => {
        if (isGenerating) return;
        setIsGenerating(true);
        try {
            const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
            const dateStr = new Date().toLocaleDateString("uk-UA");
            const response = await fetch("/fonts/Roboto-Regular.ttf");
            if (!response.ok) throw new Error("Шрифт не знайдено");
            const blob = await response.blob();
            const reader = new FileReader();
            await new Promise<void>((res, rej) => { reader.onloadend = () => res(); reader.onerror = rej; reader.readAsDataURL(blob); });
            const fontBase64 = (reader.result as string).split(",")[1];

            doc.addFileToVFS("Roboto-Regular.ttf", fontBase64);
            doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
            doc.setFont("Roboto", "normal");

            doc.setFillColor(249, 115, 22); doc.rect(0, 0, 210, 35, "F");
            doc.setTextColor(255, 255, 255); doc.setFontSize(16); doc.text("FOXFLAT : РОЗРАХУНОК ВАРТОСТІ ОРЕНДИ", 15, 15);
            doc.setFontSize(10); doc.text(`Дата: ${dateStr} | Telegram: @FoxFlat_bot`, 15, 25);

            doc.setFillColor(245, 245, 245); doc.rect(15, 45, 180, 25, "F");
            doc.setTextColor(0, 0, 0); doc.setFontSize(11); doc.text("РЕАЛЬНА ВАРТІСТЬ НА МІСЯЦЬ:", 20, 53);
            doc.setFontSize(16); doc.setTextColor(249, 115, 22); doc.text(`${fmt(monthly)} грн / міс.`, 20, 63);

            let currentY = 95;
            FIELDS.forEach(f => {
                doc.setDrawColor(230, 230, 230); doc.line(15, currentY + 2, 195, currentY + 2);
                doc.text(f.label, 15, currentY); doc.text(`${fmt(values[f.id])} грн`, 165, currentY);
                currentY += 10;
            });

            doc.save(`foxflat-zvit-${values.rent}uan.pdf`);
        } catch (e) {
            console.error(e);
            alert("Помилка генерації PDF");
        } finally { setIsGenerating(false); }
    };

    const fadeIn = (delay = 0) => ({
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay },
    });

    return (
        <main className="relative min-h-screen bg-black text-white overflow-hidden">
            {/* Підключення клієнтського Хедера як на головній */}
            <HeaderFoxFlat />
            <div className="h-14" />

            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute left-1/2 top-[-5%] h-[600px] w-[700px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-3xl" />
            </div>

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12">
                <motion.p {...fadeIn(0)} className="text-center text-xs font-bold tracking-widest text-orange-500 uppercase mb-2">Інструменти</motion.p>
                <motion.h1 {...fadeIn(0.05)} className="text-center font-black mb-2 leading-tight" style={{ fontFamily: "'Unbounded', sans-serif", fontSize: "clamp(24px, 3.5vw, 38px)", letterSpacing: "-1px" }}>
                    Калькулятор вартості оренди
                </motion.h1>
                <motion.p {...fadeIn(0.1)} className="text-center text-white/50 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                    Дізнайтесь реальну суму витрат — не лише ціну з оголошення, а всі додаткові платежі.
                </motion.p>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-8">
                    {/* ЛІВА ПАНЕЛЬ */}
                    <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.15 }} className="lg:col-span-3 space-y-4">
                        <Card>
                            <SectionLabel>Щомісячні витрати</SectionLabel>
                            <div className="space-y-3.5">
                                {FIELDS.map(f => (
                                    <Slider key={f.id} field={f} value={values[f.id]} onChange={v => setValues(prev => ({ ...prev, [f.id]: v }))} />
                                ))}
                            </div>
                        </Card>

                        <Card>
                            <SectionLabel>Витрати при заселенні</SectionLabel>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <div className="flex items-baseline justify-between"><span className="text-xs font-bold text-white/60">Застава (депозит)</span><span className="text-sm font-bold text-white">{fmt(deposit)} грн</span></div>
                                    <ToggleGroup options={DEPOSIT_MULTIPLIER} value={depositMul} onChange={setDepositMul} />
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex items-baseline justify-between"><span className="text-xs font-bold text-white/60">Комісія рієлтора</span><span className="text-sm font-bold text-white">{fmt(agent)} грн</span></div>
                                    <ToggleGroup options={AGENT_FEE} value={agentFee} onChange={setAgentFee} />
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* ПРАВА ПАНЕЛЬ */}
                    <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="lg:col-span-2 space-y-4">
                        <div className="relative rounded-2xl border border-orange-500/40 bg-orange-500/[0.04] p-4 overflow-hidden">
                            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <p className="text-xs font-bold tracking-wider text-orange-500/80 uppercase mb-1">Реальна вартість на місяць</p>
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <AnimatedNumber value={monthly} className="font-black text-white leading-none tabular-nums" style={{ fontFamily: "'Unbounded', sans-serif", fontSize: "clamp(32px, 5vw, 46px)" }} />
                                        <span className="text-base text-white/40 font-bold">грн</span>
                                    </div>
                                    <p className="text-xs font-medium text-orange-400/80">+{overpayPct}% до ціни з оголошення (+{fmt(overpay)} грн/міс)</p>
                                </div>
                                <button onClick={handleDownloadPDF} disabled={isGenerating} className={`sm:self-center flex items-center justify-center gap-2 p-3.5 rounded-xl bg-orange-500 text-black hover:bg-transparent hover:text-orange-500 border-2 border-orange-500 transition-all shrink-0 text-xs font-bold ${isGenerating ? "opacity-60 cursor-not-allowed" : ""}`}>
                                    <span>{isGenerating ? "Формування..." : "Експорт у PDF"}</span>
                                </button>
                            </div>
                        </div>

                        <Card>
                            <SectionLabel>Деталізація</SectionLabel>
                            <div className="space-y-2.5">
                                {segments.map(s => (
                                    <div key={s.id} className="space-y-1">
                                        <div className="flex justify-between items-baseline"><span className="text-xs text-white/50">{s.label}</span><span className="text-xs font-bold text-white/80 tabular-nums">{fmt(s.value)} грн</span></div>
                                        <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden"><div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} /></div>
                                    </div>
                                ))}
                                <div className="pt-2 border-t border-white/[0.05] flex justify-between items-baseline">
                                    <span className="text-xs font-bold text-white/70">Разом / місяць</span>
                                    <span className="text-sm font-bold text-orange-400 tabular-nums">{fmt(monthly)} грн</span>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <SectionLabel>При заселенні (одноразово)</SectionLabel>
                            <div className="space-y-2">
                                {moveInRows.map((row) => (
                                    <div key={row.label} className="flex justify-between items-baseline">
                                        <span className="text-xs text-white/50">{row.label}</span>
                                        <span className="text-xs font-bold text-white/80 tabular-nums">{fmt(row.val)} грн</span>
                                    </div>
                                ))}
                                <div className="pt-2 border-t border-white/[0.05] flex justify-between items-baseline">
                                    <span className="text-xs font-bold text-white/70">Потрібно мати</span>
                                    <AnimatedNumber value={moveIn} className="text-sm font-bold text-white tabular-nums" />
                                </div>
                            </div>
                        </Card>

                        <div className="relative rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 overflow-hidden">
                            <p className="text-xs font-medium text-white/70 leading-relaxed mb-3">🏠 FoxFlat знаходить нові оголошення кожні 15 хвилин — налаштуйте фільтри та отримуйте сповіщення відразу.</p>
                            <a href="https://t.me/FoxFlat_bot?start=website_calc" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-black bg-orange-500 hover:bg-transparent hover:text-orange-500 border-2 border-orange-500 transition-all" style={{ fontFamily: "'Unbounded', sans-serif" }}>
                                Запустити @FoxFlat_bot
                            </a>
                        </div>
                    </motion.div>
                </div>

                {/* ─── ЕКСПЕРТНА ПОРАДА ВІД FOXFLAT ─────────────────────────────────────── */}
                <motion.div {...fadeIn(0.25)} className="rounded-2xl border border-orange-500/20 bg-orange-500/[0.02] p-5 mb-8">
                    <h2 className="text-sm font-bold tracking-wider text-orange-400 uppercase mb-2 flex items-center gap-2">⭐ Експертна порада від FoxFlat</h2>
                    <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                        Щоб отримати ідеальну точність розрахунку, перед підписанням договору обов’язково попросіть власника квартири показати <strong>реальні квитанції за минулі місяці</strong>. Окремо подивіться на платіжки за січень (коли працює опалення) та липень (коли кондиціонери крутять світло). Введіть ці суми у калькулятор — і ви вбережете себе від раптового фінансового стресу.
                    </p>
                </motion.div>

                {/* ─── ДИНАМІЧНИЙ БЛОК: СВІЖІ СТАТТІ З ВАШОГО API ─────────── */}
                {initialPosts.length > 0 && (
                    <motion.div {...fadeIn(0.3)} className="space-y-4 mb-16">
                        <h2 className="text-[10px] font-bold tracking-[0.2em] text-orange-500 uppercase">
                            Корисні гайди з оренди житла
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {initialPosts.map((post) => {
                                const cat = CATEGORY_CONFIG[post.category];
                                return (
                                    <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col gap-3 p-3 rounded-xl border border-white/[0.05] bg-white/[0.02] hover:border-orange-500/25 hover:bg-orange-500/[0.03] transition-all duration-200">
                                        <div className="aspect-video w-full rounded-lg overflow-hidden bg-white/[0.04] relative">
                                            {post.cover_image ? (
                                                <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-500/10 to-transparent">
                                                    <span className="text-orange-500/20 text-2xl font-black" style={{ fontFamily: "'Unbounded', sans-serif" }}>{post.title[0]}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-1 flex-1 justify-between">
                                            <div className="space-y-1.5">
                                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border w-fit block ${cat?.color}`}>{cat?.label}</span>
                                                <p className="text-xs font-semibold text-white/70 group-hover:text-white transition-colors leading-snug line-clamp-2" style={{ fontFamily: "'Unbounded', sans-serif" }}>{post.title}</p>
                                            </div>
                                            <span className="text-[10px] text-white/20 mt-2 block">{post.read_time} хв читання</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* ─── ОНОВЛЕНИЙ ФІРМОВИЙ СЕО БЛОК: FAQ ─── */}
                <section className="relative py-4 px-0">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none opacity-[0.06]" style={{ background: "radial-gradient(circle, #F97316 0%, transparent 70%)" }} />
                    <div className="relative max-w-full mx-auto">
                        <motion.p {...fadeIn(0.32)} className="text-center text-xs font-bold tracking-widest text-orange-500 uppercase mb-4">FAQ</motion.p>
                        <motion.h2 {...fadeIn(0.34)} className="text-center font-black mb-4 leading-tight" style={{ fontFamily: "'Unbounded', sans-serif", fontSize: "clamp(24px, 3vw, 34px)", letterSpacing: "-1px" }}>
                            Часті запитання про вартість оренди житла
                        </motion.h2>
                        <motion.p {...fadeIn(0.36)} className="text-center text-white/40 text-sm max-w-md mx-auto mb-12 leading-relaxed">
                            Розбираємо деталі розрахунків, приховані платежі та правила ринку нерухомості України
                        </motion.p>
                        <div className="flex flex-col gap-3">
                            {faqs.map((item, i) => (
                                <FaqItem key={i} item={item} index={i} />
                            ))}
                        </div>
                        <motion.p {...fadeIn(0.4)} className="text-center text-white/30 text-sm mt-10">
                            Не знайшли потрібну відповідь?{" "}
                            <a href="https://t.me/FoxFlatSupport" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors font-semibold">
                                Напишіть нам у підтримку
                            </a>
                        </motion.p>
                    </div>
                </section>
            </div>
            <style jsx global>{`
                input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 0; height: 0; }
                input[type=range]::-moz-range-thumb { width: 0; height: 0; border: none; }
            `}</style>
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-20 max-w-4xl mx-auto text-white/60 space-y-8 border-t border-white/10 pt-12"
            >
                <div>
                    <h2 className="text-xl font-black text-white mb-4">Як правильно розрахувати бюджет на оренду квартири у 2026 році</h2>
                    <p className="leading-relaxed">
                        Планування бюджету — це перший і найважливіший крок у пошуку житла. Багато орендарів припускаються помилки, орієнтуючись лише на "чисту" ціну оренди, зазначену в оголошенні. Проте реальна вартість оренди квартири в Києві чи інших містах України складається з декількох факторів. Окрім щомісячних платежів, важливо враховувати одноразові витрати при заселенні: страховий депозит, комісію рієлтора та витрати на облаштування. Наш калькулятор дозволяє побачити повну картину витрат і обрати житло, яке не стане фінансовим тягарем.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-black text-white mb-4">Приховані платежі при оренді житла</h2>
                    <p className="leading-relaxed mb-4">
                        Досвідчені орендарі знають, що комунальні послуги — це лише частина витрат. Часто орендарі забувають про додаткові витрати, які можуть суттєво вплинути на гаманець:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Обслуговування будинку (ОСББ/ЖЕК):</strong> у новобудовах ці платежі можуть сягати 1000+ грн на місяць.</li>
                        <li><strong>Послуги інтернет-провайдерів:</strong> інколи інтернет та ТБ підключені до дорогих пакетів, які не можна змінити.</li>
                        <li><strong>Опалення:</strong> в зимовий період це найбільша стаття витрат, яку часто не враховують при літньому перегляді квартири.</li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-xl font-black text-white mb-4">Чому FoxFlat — ваш головний інструмент пошуку</h2>
                    <p className="leading-relaxed">
                        Самостійний моніторинг сайтів оголошень забирає надто багато часу, особливо в умовах дефіциту якісних квартир. FoxFlat автоматизує цей процес, збираючи пропозиції з десятків джерел. За допомогою нашого Telegram-бота ви можете не лише налаштувати параметри пошуку, а й отримувати миттєві сповіщення про нові квартири, які ідеально вписуються у ваш розрахований бюджет. Економте свій час та гроші, обираючи житло ефективно.
                    </p>
                </div>
            </motion.section>
        </main>
    );
}