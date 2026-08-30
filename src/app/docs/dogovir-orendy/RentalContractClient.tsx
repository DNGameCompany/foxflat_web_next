"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, animate, useMotionValue } from "framer-motion";
import {
    Download,
    FileText,
    ClipboardCheck,
    KeyRound,
    Scale,
    ChevronRight,
    ChevronLeft,
    Check,
    Maximize2,
    X,
} from "lucide-react";
import HeaderFoxFlat from "@/src/components/HeaderFoxFlat";
import * as gTag from "@/lib/gtag";
import { addDoc, collection, doc, increment, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// 🔗 ПОСИЛАННЯ НА ВАШУ БАНКУ MONOBANK АБО LIQPAY
const MONOBANK_JAR_URL = "https://send.monobank.ua/jar/2BrMzU78xp"; // Замініть на ваше посилання

interface DocSection {
    icon: React.ElementType;
    title: string;
    desc: string;
    pages: string;
}

const DOC_SECTIONS: DocSection[] = [
    {
        icon: FileText,
        title: "Договір найму",
        desc: "14 розділів: предмет, строк, орендна плата, застава, комуналка, права й обов'язки сторін, розірвання, відповідальність.",
        pages: "стор. 1–4",
    },
    {
        icon: ClipboardCheck,
        title: "Додаток 1 — Опис майна",
        desc: "Стан стін, підлоги, сантехніки та техніки, перелік меблів і показники лічильників на момент передачі.",
        pages: "стор. 5–6",
    },
    {
        icon: KeyRound,
        title: "Додаток 2 — Акт прийому-передачі",
        desc: "Фіксує факт заселення, кількість переданих ключів і відсутність претензій з боку орендаря.",
        pages: "стор. 7",
    },
    {
        icon: KeyRound,
        title: "Додаток 3 — Акт повернення",
        desc: "Стан об'єкта при виїзді, доля забезпечувального платежу та наявність претензій сторін.",
        pages: "стор. 8",
    },
    {
        icon: Scale,
        title: "Правова довідка",
        desc: "Таблиця ключових статей ЦКУ (759–826), на які спирається кожен пункт договору — щоб не гуглити окремо.",
        pages: "стор. 9",
    },
];

const LEGAL_ARTICLES = [
    { art: "Ст. 762 ЦКУ", note: "Орендну плату не можна підняти в односторонньому порядку" },
    { art: "Ст. 764 ЦКУ", note: "Договір продовжується автоматично, якщо жодна зі сторін не заперечила" },
    { art: "Ст. 776 ЦКУ", note: "Капітальний ремонт — обов'язок орендодавця, не орендаря" },
    { art: "Ст. 777 ЦКУ", note: "Орендар має переважне право поновити договір на новий строк" },
    { art: "Ст. 825 ЦКУ", note: "Підстави дострокового розірвання — окремо для орендаря і для орендодавця" },
];

const CHECKLIST: { text: string; href?: string }[] = [
    {
        text: "Право власності підтверджене документом — попросіть показати оригінал",
        href: "/blog/yak-perevirty-vlasnyka-kvartyry-pered-orendoyu",
    },
    { text: "Об'єкт не в заставі, арешті чи під судовим спором (п. 1.3 договору)" },
    { text: "Показники лічильників зафіксовані в Акті прийому-передачі до заселення" },
    { text: "Умови повернення застави та строк виплати чітко прописані (п. 4.4)" },
    {
        text: "Зрозуміло, хто платить за ОСББ/ЖЕК і чи фіксована сума опалення",
        href: "/blog/komunalni-plateji-pri-orendi-kvartiry-v-ukraini",
    },
    { text: "Строк попередження про виїзд чи розірвання влаштовує обидві сторони" },
];

const RELATED_ARTICLES = [
    {
        href: "/blog/dohovir-orendy-kvartyry-shcho-maye-buty",
        title: "Договір оренди квартири: що обов'язково має бути",
        desc: "Повний розбір пунктів договору та на що звернути увагу",
    },
    {
        href: "/blog/depozyt-pry-orendi-kvartyry-yak-povernuty",
        title: "Депозит при оренді квартири: навіщо потрібен і як повернути",
        desc: "Детальніше про заставу з розділу 4 цього договору",
    },
    {
        href: "/blog/yak-perevirty-vlasnyka-kvartyry-pered-orendoyu",
        title: "Як перевірити власника квартири перед орендою",
        desc: "Покроковий гайд перед підписанням, щоб уникнути шахраїв",
    },
    {
        href: "/blog/komunalni-plateji-pri-orendi-kvartiry-v-ukraini",
        title: "Комунальні платежі при оренді квартири: хто платить і скільки",
        desc: "Детальніше про розділ 5 договору — хто за що відповідає",
    },
];

const faqs = [
    {
        q: "Чи потрібно нотаріально засвідчувати договір оренди квартири?",
        a: "Ні, за законодавством України нотаріальне посвідчення договору найму житла між фізичними особами не є обов'язковим. Сторони можуть зробити це додатково за власним бажанням, але для чинності договору достатньо підписів обох сторін.",
    },
    {
        q: "Скільки примірників договору потрібно підписати?",
        a: "Два — по одному для кожної сторони. Обидва мають однакову юридичну силу (п. 13.2 шаблону).",
    },
    {
        q: "Чи може орендодавець підняти орендну плату посеред строку дії договору?",
        a: "Ні. Стаття 762 ЦКУ забороняє одностороннє підвищення орендної плати. Зміна можлива лише за письмовою згодою обох сторін і не частіше одного разу на рік (п. 3.4 шаблону).",
    },
    {
        q: "Що робити, якщо орендодавець відмовляється повертати заставу?",
        a: "Пункт 4.5 шаблону передбачає право орендаря вимагати повернення застави у подвійному розмірі, якщо кошти утримуються без обґрунтованих підстав. Якщо сторони не домовляються, питання вирішується в суді.",
    },
    {
        q: "Чи є цей шаблон готовим юридично чинним документом?",
        a: "Це зразок із посиланнями на статті Цивільного кодексу України. Він стає чинним договором лише після того, як сторони заповнять усі реквізити, узгодять умови та власноручно підпишуть кожен примірник.",
    },
    {
        q: "Що робити, якщо в оголошенні одна ціна, а орендодавець хоче змінити умови на місці?",
        a: "Усі умови — ціну, заставу, комісію, строк — фіксуйте письмово в договорі до передачі грошей. Усне «домовились на словах» неможливо довести в разі спору, тоді як підписаний договір має юридичну силу.",
    },
];

// ─────────────────────────────────────────────────────────────
// Логування завантажень договору у Firestore
// ─────────────────────────────────────────────────────────────
async function logContractDownload() {
    try {
        await Promise.all([
            setDoc(
                doc(db, "stats", "contract_downloads"),
                { count: increment(1), lastDownloadAt: serverTimestamp() },
                { merge: true }
            ),
            addDoc(collection(db, "contract_downloads_log"), {
                createdAt: serverTimestamp(),
            }),
        ]);
    } catch (error) {
        console.error("Не вдалося залогувати завантаження договору:", error);
    }
}

function FaqItem({ item, index }: { item: (typeof faqs)[0]; index: number }) {
    const [open, setOpen] = useState(false);

    const handleToggle = () => {
        const next = !open;
        setOpen(next);
        if (next) {
            gTag.event({ action: "faq_open", category: "contract_page", label: item.q });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className={`border rounded-xl overflow-hidden transition-colors duration-200 ${
                open
                    ? "border-orange-500/30 bg-orange-500/[0.04]"
                    : "border-white/[0.06] bg-white/[0.02] hover:border-white/10"
            }`}
        >
            <button
                onClick={handleToggle}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                aria-expanded={open}
            >
                <h3
                    className={`text-sm font-semibold leading-snug transition-colors ${
                        open ? "text-orange-400" : "text-white"
                    }`}
                    style={{ fontFamily: "'Unbounded', sans-serif", fontSize: "13px" }}
                >
                    {item.q}
                </h3>
                <span
                    className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        open ? "bg-orange-500 text-black rotate-45" : "bg-white/[0.06] text-white/40"
                    }`}
                >
                    +
                </span>
            </button>
            <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                }`}
            >
                <p className="px-6 pb-5 text-xs sm:text-sm text-white/50 leading-relaxed">{item.a}</p>
            </div>
        </motion.div>
    );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 ${className}`}>
            {children}
        </div>
    );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return <p className="text-xs font-bold tracking-wider text-white/30 uppercase mb-3">{children}</p>;
}

// Кнопка донату з пульсацією
function MilitaryDonateButton({
                                  onClick,
                                  label = "Підтримати 79 ОШБр",
                                  small = false,
                              }: {
    onClick: () => void;
    label?: string;
    small?: boolean;
}) {
    return (
        <motion.a
            href={MONOBANK_JAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClick}
            animate={{
                scale: [1, 1.04, 1],
                boxShadow: [
                    "0 10px 25px -5px rgba(59, 130, 246, 0.25)",
                    "0 10px 35px -5px rgba(59, 130, 246, 0.45)",
                    "0 10px 25px -5px rgba(59, 130, 246, 0.25)",
                ],
            }}
            transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={`group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-amber-400 font-bold text-black shadow-lg shadow-blue-500/25 transition-colors hover:brightness-105 ${
                small
                    ? "px-4 py-3 text-xs"
                    : "px-5 py-3 text-sm sm:rounded-2xl sm:px-6 sm:py-3.5 sm:text-base"
            }`}
        >
            <span>{label}</span>
            <svg
                className="h-4 w-4 flex-shrink-0 transition-transform group-hover:translate-x-0.5 sm:h-5 sm:w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
            </svg>
        </motion.a>
    );
}

const TOTAL_PAGES = 9;
const PAGE_IMAGE = (n: number) => `/images/dogovir-preview/page-${n}.webp`;

const QUICK_JUMP = [
    { label: "Договір", page: 1, from: 1, to: 4 },
    { label: "Опис майна", page: 5, from: 5, to: 6 },
    { label: "Акт передачі", page: 7, from: 7, to: 7 },
    { label: "Акт повернення", page: 8, from: 8, to: 8 },
    { label: "Довідка ЦКУ", page: 9, from: 9, to: 9 },
];

function useSwipe({
                      onSwipeLeft,
                      onSwipeRight,
                      enabled = true,
                      threshold = 45,
                  }: {
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
    enabled?: boolean;
    threshold?: number;
}) {
    const startRef = useRef<{ x: number; y: number } | null>(null);
    const movedRef = useRef(false);

    const onTouchStart = useCallback(
        (e: React.TouchEvent) => {
            if (!enabled || e.touches.length !== 1) {
                startRef.current = null;
                return;
            }
            startRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            movedRef.current = false;
        },
        [enabled]
    );

    const onTouchMove = useCallback((e: React.TouchEvent) => {
        if (!startRef.current || e.touches.length !== 1) return;
        const dx = e.touches[0].clientX - startRef.current.x;
        const dy = e.touches[0].clientY - startRef.current.y;
        if (Math.abs(dx) > 8 || Math.abs(dy) > 8) movedRef.current = true;
    }, []);

    const onTouchEnd = useCallback(
        (e: React.TouchEvent) => {
            if (!startRef.current) return;
            const dx = e.changedTouches[0].clientX - startRef.current.x;
            const dy = e.changedTouches[0].clientY - startRef.current.y;
            startRef.current = null;
            if (Math.abs(dx) > threshold && Math.abs(dx) > Math.abs(dy) * 1.4) {
                if (dx < 0) onSwipeLeft();
                else onSwipeRight();
            }
        },
        [onSwipeLeft, onSwipeRight, threshold]
    );

    const wasDragged = useCallback(() => movedRef.current, []);

    return { onTouchStart, onTouchMove, onTouchEnd, wasDragged };
}

function ZoomableLightboxImage({
                                   src,
                                   alt,
                                   onSwipe,
                               }: {
    src: string;
    alt: string;
    onSwipe: (dir: 1 | -1) => void;
}) {
    const scale = useMotionValue(1);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const pinchState = useRef<{ initialDistance: number; initialScale: number } | null>(null);
    const panState = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(
        null
    );
    const swipeState = useRef<{ x: number; y: number } | null>(null);
    const lastTapRef = useRef(0);

    useEffect(() => {
        scale.set(1);
        x.set(0);
        y.set(0);
    }, [src, scale, x, y]);

    const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

    const getBounds = (currentScale: number) => {
        const container = containerRef.current;
        if (!container) return { maxX: 0, maxY: 0 };
        const rect = container.getBoundingClientRect();
        return {
            maxX: Math.max(0, (rect.width * (currentScale - 1)) / 2),
            maxY: Math.max(0, (rect.height * (currentScale - 1)) / 2),
        };
    };

    const distanceBetween = (t1: React.Touch, t2: React.Touch) =>
        Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);

    const animateTo = (s: number, tx: number, ty: number) => {
        animate(scale, s, { type: "spring", stiffness: 300, damping: 30 });
        animate(x, tx, { type: "spring", stiffness: 300, damping: 30 });
        animate(y, ty, { type: "spring", stiffness: 300, damping: 30 });
    };

    const toggleZoom = () => {
        const targetScale = scale.get() > 1.05 ? 1 : 2.4;
        animateTo(targetScale, 0, 0);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 2) {
            pinchState.current = {
                initialDistance: distanceBetween(e.touches[0], e.touches[1]),
                initialScale: scale.get(),
            };
            panState.current = null;
            swipeState.current = null;
            return;
        }

        if (e.touches.length === 1) {
            const now = Date.now();
            if (now - lastTapRef.current < 280) {
                lastTapRef.current = 0;
                toggleZoom();
                return;
            }
            lastTapRef.current = now;

            if (scale.get() > 1.05) {
                panState.current = {
                    startX: e.touches[0].clientX,
                    startY: e.touches[0].clientY,
                    originX: x.get(),
                    originY: y.get(),
                };
                swipeState.current = null;
            } else {
                swipeState.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                panState.current = null;
            }
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (e.touches.length === 2 && pinchState.current) {
            e.preventDefault();
            const dist = distanceBetween(e.touches[0], e.touches[1]);
            const ratio = dist / pinchState.current.initialDistance;
            const newScale = clamp(pinchState.current.initialScale * ratio, 1, 4);
            scale.set(newScale);
            const { maxX, maxY } = getBounds(newScale);
            x.set(clamp(x.get(), -maxX, maxX));
            y.set(clamp(y.get(), -maxY, maxY));
            return;
        }

        if (e.touches.length === 1 && panState.current) {
            e.preventDefault();
            const dx = e.touches[0].clientX - panState.current.startX;
            const dy = e.touches[0].clientY - panState.current.startY;
            const { maxX, maxY } = getBounds(scale.get());
            x.set(clamp(panState.current.originX + dx, -maxX, maxX));
            y.set(clamp(panState.current.originY + dy, -maxY, maxY));
        }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        pinchState.current = null;
        panState.current = null;

        if (scale.get() < 1) {
            animateTo(1, 0, 0);
        }

        if (swipeState.current && e.changedTouches.length === 1 && scale.get() <= 1.05) {
            const dx = e.changedTouches[0].clientX - swipeState.current.x;
            const dy = e.changedTouches[0].clientY - swipeState.current.y;
            if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) {
                onSwipe(dx < 0 ? 1 : -1);
            }
        }
        swipeState.current = null;
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full flex items-center justify-center touch-none select-none"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <motion.img
                src={src}
                alt={alt}
                style={{ scale, x, y }}
                className="max-h-[88vh] sm:max-h-[92vh] max-w-[94vw] sm:max-w-[92vw] w-auto h-auto rounded-lg shadow-2xl cursor-default select-none"
                draggable={false}
                onDoubleClick={(e) => {
                    e.stopPropagation();
                    toggleZoom();
                }}
            />
        </div>
    );
}

function LightboxModal({
                           index,
                           total,
                           onClose,
                           onPrev,
                           onNext,
                       }: {
    index: number;
    total: number;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}) {
    return (
        <div
            className="fixed inset-0 z-[100] bg-black/92 backdrop-blur-sm flex items-center justify-center p-2 sm:p-8"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                aria-label="Закрити"
                className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center transition-colors"
            >
                <X className="w-5 h-5" strokeWidth={2.5} />
            </button>

            <span className="absolute top-5 left-1/2 -translate-x-1/2 z-10 text-xs font-bold text-white/60">
                Сторінка {index + 1} з {total}
            </span>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onPrev();
                }}
                aria-label="Попередня сторінка"
                className="hidden sm:flex absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white items-center justify-center transition-colors"
            >
                <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
            </button>

            <ZoomableLightboxImage
                key={index}
                src={PAGE_IMAGE(index + 1)}
                alt={`Договір найму житла — сторінка ${index + 1} з ${total}, збільшено`}
                onSwipe={(dir) => (dir === 1 ? onNext() : onPrev())}
            />

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                }}
                aria-label="Наступна сторінка"
                className="hidden sm:flex absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white items-center justify-center transition-colors"
            >
                <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
            </button>

            <span className="sm:hidden absolute bottom-5 left-1/2 -translate-x-1/2 z-10 text-[11px] font-bold text-white/40 pointer-events-none text-center px-6">
                Гортайте пальцем · Двічі торкніться, щоб наблизити
            </span>
        </div>
    );
}

function DocumentPreview({
                             onDownload,
                             downloading,
                             onDonate,
                         }: {
    onDownload: () => void;
    downloading: boolean;
    onDonate: () => void;
}) {
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!lightboxOpen) return;
        document.body.style.overflow = "hidden";
        document.body.style.touchAction = "none";
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setLightboxOpen(false);
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
        };
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = "";
            document.body.style.touchAction = "";
            window.removeEventListener("keydown", onKey);
        };
    }, [lightboxOpen, index]);

    const goTo = (i: number, label?: string) => {
        const clamped = (i + TOTAL_PAGES) % TOTAL_PAGES;
        setDirection(clamped > index ? 1 : -1);
        setIndex(clamped);
        gTag.event({
            action: "preview_page_view",
            category: "contract_page",
            label: label ?? `page_${clamped + 1}`,
        });
    };
    const prev = () => goTo(index - 1);
    const next = () => goTo(index + 1);

    const swipe = useSwipe({
        onSwipeLeft: next,
        onSwipeRight: prev,
        enabled: !lightboxOpen,
    });

    const openLightbox = () => {
        if (swipe.wasDragged()) return;
        setLightboxOpen(true);
        gTag.event({
            action: "preview_zoom_open",
            category: "contract_page",
            label: `page_${index + 1}`,
        });
    };

    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-2.5 sm:p-3">
            <div className="flex gap-1.5 overflow-x-auto pb-0.5 mb-3">
                {QUICK_JUMP.map((q) => {
                    const isActive = index + 1 >= q.from && index + 1 <= q.to;
                    return (
                        <button
                            key={q.page}
                            onClick={() => goTo(q.page - 1, q.label)}
                            className={`flex-shrink-0 text-xs font-bold py-2 px-3 rounded-lg border transition-all duration-150 ${
                                isActive
                                    ? "bg-orange-500/15 border-orange-500/40 text-orange-400"
                                    : "border-white/[0.07] text-white/40 hover:text-white/60"
                            }`}
                        >
                            {q.label}
                        </button>
                    );
                })}
            </div>

            <div className="relative">
                <div
                    className="relative rounded-xl overflow-hidden bg-[#f7f4ee] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] aspect-[1/1.414] touch-pan-y"
                    onTouchStart={swipe.onTouchStart}
                    onTouchMove={swipe.onTouchMove}
                    onTouchEnd={swipe.onTouchEnd}
                >
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.img
                            key={index}
                            src={PAGE_IMAGE(index + 1)}
                            alt={`Договір найму житла — сторінка ${index + 1} з ${TOTAL_PAGES}`}
                            custom={direction}
                            initial={{ opacity: 0, x: 40 * direction }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 * direction }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            onClick={openLightbox}
                            className="absolute inset-0 w-full h-full object-contain cursor-zoom-in"
                            loading="lazy"
                            draggable={false}
                        />
                    </AnimatePresence>

                    <span className="absolute top-3 right-3 z-10 text-[10px] font-bold text-black/50 bg-white/80 backdrop-blur px-2 py-1 rounded-full pointer-events-none">
                        {index + 1} / {TOTAL_PAGES}
                    </span>
                    <span className="hidden sm:flex absolute bottom-3 right-3 z-10 items-center gap-1 text-[10px] font-bold text-black/50 bg-white/80 backdrop-blur px-2 py-1 rounded-full pointer-events-none">
                        <Maximize2 className="w-3 h-3" strokeWidth={2.5} />
                        Наблизити
                    </span>
                    <span className="sm:hidden absolute bottom-3 left-3 z-10 text-[10px] font-bold text-black/50 bg-white/80 backdrop-blur px-2 py-1 rounded-full pointer-events-none">
                        Гортай ⇆
                    </span>
                </div>

                <button
                    onClick={prev}
                    aria-label="Попередня сторінка"
                    className="absolute left-1.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-black/60 backdrop-blur border border-white/10 text-white/70 flex items-center justify-center hover:bg-black/80 hover:text-white transition-all"
                >
                    <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
                </button>
                <button
                    onClick={next}
                    aria-label="Наступна сторінка"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-black/60 backdrop-blur border border-white/10 text-white/70 flex items-center justify-center hover:bg-black/80 hover:text-white transition-all"
                >
                    <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
                </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 mt-3">
                {Array.from({ length: TOTAL_PAGES }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        aria-label={`Сторінка ${i + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-200 ${
                            i === index ? "w-5 bg-orange-500" : "w-1.5 bg-white/15 hover:bg-white/30"
                        }`}
                    />
                ))}
            </div>

            {/* Блок з двома кнопками для зручності під прев'ю */}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                    type="button"
                    onClick={onDownload}
                    disabled={downloading}
                    className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl border-2 border-orange-500/40 text-orange-400 hover:bg-orange-500/10 transition-all text-xs font-bold w-full disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    <Download className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2.5} />
                    <span>{downloading ? "Завантаження…" : "Завантажити PDF"}</span>
                </button>

                <MilitaryDonateButton onClick={onDonate} label="Підтримати 79 ОШБр" small />
            </div>

            {mounted &&
                lightboxOpen &&
                createPortal(
                    <LightboxModal
                        index={index}
                        total={TOTAL_PAGES}
                        onClose={() => setLightboxOpen(false)}
                        onPrev={prev}
                        onNext={next}
                    />,
                    document.body
                )}
        </div>
    );
}

const DOWNLOAD_WAIT_SECONDS = 10;

export default function RentalContractClient({ pdfUrl }: { pdfUrl: string }) {
    const [downloading, setDownloading] = useState(false);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [showThanksModal, setShowThanksModal] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(DOWNLOAD_WAIT_SECONDS);
    const [showManualFallback, setShowManualFallback] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    // Відлік під час завантаження + поява ручного фолбеку, якщо файл сам не завантажився
    useEffect(() => {
        if (!showDownloadModal) return;

        setSecondsLeft(DOWNLOAD_WAIT_SECONDS);
        setShowManualFallback(false);

        const tick = setInterval(() => {
            setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
        }, 1000);

        const fallbackTimer = setTimeout(() => {
            setShowManualFallback(true);
        }, DOWNLOAD_WAIT_SECONDS * 1000);

        return () => {
            clearInterval(tick);
            clearTimeout(fallbackTimer);
        };
    }, [showDownloadModal]);

    const handleManualDownloadClick = async () => {
        try {
            const res = await fetch(pdfUrl, { credentials: "same-origin" });
            if (!res.ok) throw new Error("Download failed");

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "dogovir-najmu-zhytla.pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);

            logContractDownload();
            gTag.event({
                action: "download_contract_template",
                category: "contract_page",
                label: "PDF template manual fallback click",
            });
        } catch {
            window.open(pdfUrl, "_blank", "noopener,noreferrer");
            logContractDownload();
            gTag.event({
                action: "download_contract_template",
                category: "contract_page",
                label: "PDF template manual fallback window.open",
            });
        } finally {
            setShowDownloadModal(false);
            setDownloading(false);
            setShowThanksModal(true);
        }
    };

    const handleDownload = async () => {
        if (downloading) return;
        setDownloading(true);
        setShowDownloadModal(true);

        const minDelay = new Promise((resolve) => setTimeout(resolve, DOWNLOAD_WAIT_SECONDS * 1000));

        try {
            const [res] = await Promise.all([
                fetch(pdfUrl, { credentials: "same-origin" }),
                minDelay,
            ]);

            if (!res.ok) throw new Error("Download failed");

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "dogovir-najmu-zhytla.pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);

            logContractDownload();

            gTag.event({
                action: "download_contract_template",
                category: "contract_page",
                label: "PDF template download",
            });
        } catch {
            window.open(pdfUrl, "_blank", "noopener,noreferrer");
            logContractDownload();
            gTag.event({
                action: "download_contract_template",
                category: "contract_page",
                label: "PDF template download fallback",
            });
        } finally {
            setShowDownloadModal(false);
            setDownloading(false);
            // Показуємо прохання про донат ПІСЛЯ того, як людина отримала файл —
            // а не поки вона ще чекає завантаження.
            setShowThanksModal(true);
        }
    };

    const handleDonateClick = () => {
        gTag.event({
            action: "click_donate_monobank",
            category: "contract_page",
            label: "79 ОШБр — Monobank Jar",
        });
    };

    const handlePostDownloadDonateClick = () => {
        handleDonateClick();
        gTag.event({
            action: "click_donate_post_download",
            category: "contract_page",
            label: "thanks_modal",
        });
    };

    const fadeIn = (delay = 0) => ({
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay },
    });

    return (
        <main className="relative min-h-screen bg-black text-white">
            <HeaderFoxFlat />
            <div className="h-14" />

            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute left-1/2 top-[-5%] h-[600px] w-[700px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-3xl" />
            </div>

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12">
                <motion.p
                    {...fadeIn(0)}
                    className="text-center text-xs font-bold tracking-widest text-orange-500 uppercase mb-2"
                >
                    Документи
                </motion.p>
                <motion.h1
                    {...fadeIn(0.05)}
                    className="text-center font-black mb-2 leading-tight"
                    style={{
                        fontFamily: "'Unbounded', sans-serif",
                        fontSize: "clamp(24px, 3.5vw, 38px)",
                        letterSpacing: "-1px",
                    }}
                >
                    Договір оренди квартири — шаблон PDF
                </motion.h1>
                <motion.p
                    {...fadeIn(0.1)}
                    className="text-center text-white/50 text-sm max-w-lg mx-auto mb-8 leading-relaxed"
                >
                    Типова форма за гл. 59 § 2 Цивільного кодексу України: сам договір, опис майна, акти
                    прийому-передачі та повернення — 9 сторінок, готові до заповнення.
                </motion.p>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6 items-start">
                    <motion.div {...fadeIn(0.2)} className="lg:col-span-7 lg:order-1">
                        <DocumentPreview
                            onDownload={handleDownload}
                            downloading={downloading}
                            onDonate={handleDonateClick}
                        />
                    </motion.div>

                    <div className="lg:col-span-5 lg:order-2 lg:sticky lg:top-20 self-start space-y-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.15 }}
                            className="space-y-4"
                        >
                            <div className="relative rounded-2xl border border-orange-500/40 bg-orange-500/[0.04] p-5 overflow-hidden">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex-shrink-0 w-12 h-14 rounded-lg bg-white/[0.04] border border-white/10 flex flex-col items-center justify-center gap-1">
                                        <FileText className="w-5 h-5 text-orange-400" strokeWidth={1.5} />
                                        <span className="text-[8px] font-bold text-white/40 tracking-wider">
                                            PDF
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold tracking-wider text-orange-500/80 uppercase mb-1">
                                            Безкоштовно · без реєстрації
                                        </p>
                                        <h2
                                            className="text-white font-bold leading-snug"
                                            style={{
                                                fontFamily: "'Unbounded', sans-serif",
                                                fontSize: "13.5px",
                                            }}
                                        >
                                            Договір найму житлового приміщення
                                        </h2>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-white/40 mb-4">
                                    <span>9 сторінок</span>
                                    <span className="w-1 h-1 rounded-full bg-white/20 mt-1.5" />
                                    <span>3 додатки</span>
                                    <span className="w-1 h-1 rounded-full bg-white/20 mt-1.5" />
                                    <span>Формат A4</span>
                                </div>

                                {/* ГОЛОВНА КНОПКА ЗАВАНТАЖЕННЯ */}
                                <button
                                    type="button"
                                    onClick={handleDownload}
                                    disabled={downloading}
                                    className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-orange-500 text-black hover:bg-transparent hover:text-orange-500 border-2 border-orange-500 transition-all text-sm font-bold w-full disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-orange-500/10"
                                    style={{ fontFamily: "'Unbounded', sans-serif" }}
                                >
                                    <Download className="w-4 h-4 stroke-[2.5]" />
                                    {downloading ? "Завантаження…" : "Завантажити PDF"}
                                </button>
                            </div>

                            <Card>
                                <SectionLabel>Що входить у файл</SectionLabel>
                                <div>
                                    {DOC_SECTIONS.map((s, i) => (
                                        <div
                                            key={s.title}
                                            className={`flex items-center gap-2.5 py-2 ${
                                                i !== 0 ? "border-t border-white/[0.05]" : ""
                                            }`}
                                        >
                                            <div className="w-7 h-7 rounded-md bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
                                                <s.icon
                                                    className="w-3.5 h-3.5 text-orange-400"
                                                    strokeWidth={2}
                                                />
                                            </div>
                                            <p className="flex-1 min-w-0 text-xs font-bold text-white leading-snug">
                                                {s.title}
                                            </p>
                                            <span className="text-[10px] text-white/25 flex-shrink-0">
                                                {s.pages}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card>
                                <SectionLabel>Перед підписанням перевірте</SectionLabel>
                                <div className="space-y-2">
                                    {CHECKLIST.map((item) => {
                                        const href = item.href;
                                        return (
                                            <div key={item.text} className="flex items-start gap-2">
                                                <Check
                                                    className="w-3.5 h-3.5 text-orange-400 flex-shrink-0 mt-0.5"
                                                    strokeWidth={3}
                                                />
                                                {href ? (
                                                    <a
                                                        href={href}
                                                        onClick={() =>
                                                            gTag.event({
                                                                action: "click_checklist_link",
                                                                category: "contract_page",
                                                                label: href,
                                                            })
                                                        }
                                                        className="text-[11px] text-white/55 leading-relaxed hover:text-orange-400 underline decoration-white/20 underline-offset-2 transition-colors"
                                                    >
                                                        {item.text}
                                                    </a>
                                                ) : (
                                                    <span className="text-[11px] text-white/55 leading-relaxed">
                                                        {item.text}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </div>

                <motion.div {...fadeIn(0.24)} className="mb-10">
                    <div className="rounded-2xl border border-orange-500/20 bg-orange-500/[0.03] p-5 sm:p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <Scale className="w-4 h-4 text-orange-400" strokeWidth={2} />
                            <p className="text-xs font-bold tracking-wider text-orange-400/80 uppercase">
                                Норми ЦКУ, на які варто спертись
                            </p>
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-5 sm:overflow-visible">
                            {LEGAL_ARTICLES.map((a) => (
                                <div
                                    key={a.art}
                                    className="flex-shrink-0 w-[200px] sm:w-auto rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                                >
                                    <p className="text-orange-400 font-bold text-xs mb-2">{a.art}</p>
                                    <p className="text-[11px] text-white/50 leading-relaxed">{a.note}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                <motion.div {...fadeIn(0.3)} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <a
                        href="/tools/calculator"
                        onClick={() =>
                            gTag.event({
                                action: "click_calculator_link",
                                category: "contract_page",
                                label: "cross_link",
                            })
                        }
                        className="group flex items-center justify-between gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 hover:border-orange-500/25 hover:bg-orange-500/[0.03] transition-all"
                    >
                        <div>
                            <p className="text-sm font-bold text-white mb-1">
                                Порахувати реальну вартість оренди
                            </p>
                            <p className="text-xs text-white/40">Комуналка, застава, комісія — в один клік</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-orange-400 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                    </a>

                    <a
                        href="/tools/checklist"
                        onClick={() =>
                            gTag.event({
                                action: "click_checklist_link",
                                category: "contract_page",
                                label: "cross_link",
                            })
                        }
                        className="group flex items-center justify-between gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 hover:border-orange-500/25 hover:bg-orange-500/[0.03] transition-all"
                    >
                        <div>
                            <p className="text-sm font-bold text-white mb-1">Чек-лист огляду квартири</p>
                            <p className="text-xs text-white/40">
                                Що перевірити ще до підписання цього договору
                            </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-orange-400 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                    </a>
                </motion.div>

                <motion.div {...fadeIn(0.32)} className="mb-4">
                    <SectionLabel>Читайте також</SectionLabel>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {RELATED_ARTICLES.map((post) => (
                            <a
                                key={post.href}
                                href={post.href}
                                onClick={() =>
                                    gTag.event({
                                        action: "click_related_article",
                                        category: "contract_page",
                                        label: post.href,
                                    })
                                }
                                className="group flex items-center justify-between gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 hover:border-orange-500/25 hover:bg-orange-500/[0.03] transition-all"
                            >
                                <div>
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border w-fit block mb-2 text-green-400 bg-green-400/10 border-green-400/20">
                                        Гайд
                                    </span>
                                    <p className="text-sm font-bold text-white mb-1">{post.title}</p>
                                    <p className="text-xs text-white/40">{post.desc}</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-orange-400 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                            </a>
                        ))}
                    </div>
                </motion.div>

                <motion.div {...fadeIn(0.34)} className="mb-12">
                    <a
                        href="https://t.me/FoxFlat_bot?start=website_contract"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                            gTag.event({
                                action: "click_telegram_bot",
                                category: "contract_page",
                                label: "website_contract_banner",
                            })
                        }
                        className="flex items-center justify-center gap-2 rounded-2xl font-bold text-xs sm:text-sm text-black bg-orange-500 hover:bg-transparent hover:text-orange-500 border-2 border-orange-500 transition-all p-5 w-full"
                        style={{ fontFamily: "'Unbounded', sans-serif" }}
                    >
                        Знайти квартиру через @FoxFlat_bot
                    </a>
                </motion.div>

                <section className="relative py-4 px-0">
                    <div className="space-y-4 max-w-4xl mx-auto">
                        {faqs.map((item, index) => (
                            <FaqItem key={index} item={item} index={index} />
                        ))}
                    </div>
                </section>
            </div>

            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-20 max-w-4xl mx-auto px-4 sm:px-6 text-white/60 space-y-8 border-t border-white/10 pt-12"
            >
                <div>
                    <h2 className="text-xl font-black text-white mb-4">
                        Навіщо оформлювати договір оренди письмово
                    </h2>
                    <p className="leading-relaxed">
                        Усна домовленість про оренду не захищає жодну зі сторін: якщо виникне спір про суму
                        застави, строк попередження про виїзд чи стан техніки при заселенні, довести свою
                        правоту без документа майже неможливо. Письмовий договір фіксує ціну, строк, права та
                        обов&#39;язки обох сторін і дає підставу звернутися до суду, якщо умови порушено.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-black text-white mb-4">Як користуватись цим шаблоном</h2>
                    <p className="leading-relaxed mb-4">
                        Завантажте PDF, роздрукуйте у двох примірниках і заповніть порожні поля разом з другою
                        стороною ще до передачі грошей. Зверніть особливу увагу на три моменти:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            <strong>Опис майна (Додаток 1):</strong> зафіксуйте стан техніки та показники
                            лічильників — це головний доказ у разі спору про заставу.
                        </li>
                        <li>
                            <strong>Умови застави (п. 4):</strong> пропишіть конкретний строк повернення коштів
                            і підстави для утримання.
                        </li>
                        <li>
                            <strong>Порядок зміни ціни (п. 3.4):</strong> переконайтесь, що підвищення оренди
                            можливе лише за письмовою згодою обох сторін.
                        </li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-xl font-black text-white mb-4">
                        Шаблон — це відправна точка, не заміна юриста
                    </h2>
                    <p className="leading-relaxed">
                        Документ складено на основі типових норм глави 59 Цивільного кодексу України та
                        охоплює найчастіші ситуації в оренді житла. Але кожна угода індивідуальна: якщо в
                        об&#39;єкті є співвласники, іпотека чи нестандартні умови, перед підписанням варто
                        показати заповнений договір юристу.
                    </p>
                </div>
            </motion.section>

            {/* МОДАЛКА ПІД ЧАС ЗАВАНТАЖЕННЯ */}
            {mounted &&
                showDownloadModal &&
                createPortal(
                    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                        <div
                            className="w-full max-w-sm rounded-2xl bg-[#111] p-8 text-center shadow-2xl"
                            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                            <div className="mx-auto mb-4 w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-amber-400/20 border border-white/10">
                                <Image
                                    src="/images/tryzub.png"
                                    alt="Тризуб"
                                    width={28}
                                    height={28}
                                    className="w-7 h-7 object-contain"
                                />
                            </div>

                            <p
                                className="text-white font-bold mb-2"
                                style={{ fontFamily: "'Unbounded', sans-serif", fontSize: "15px" }}
                            >
                                Поки файл готується
                            </p>
                            <p className="text-sm text-white/55 leading-relaxed mb-5">
                                Хлопці 79 ОШБр потребують допомоги прямо зараз.
                            </p>

                            <MilitaryDonateButton onClick={handleDonateClick} />

                            <div className="mt-5 flex items-center justify-center gap-1.5 text-[10px] text-white/25">
                                <div className="w-2.5 h-2.5 rounded-full border-2 border-white/15 border-t-white/40 animate-spin" />
                                <span>
                                    {secondsLeft > 0
                                        ? `завантаження почнеться через ${secondsLeft} с…`
                                        : "завантажуємо…"}
                                </span>
                            </div>

                            {showManualFallback && (
                                <button
                                    onClick={handleManualDownloadClick}
                                    className="mt-3 text-xs text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors"
                                >
                                    Завантаження не почалось? Натисніть сюди
                                </button>
                            )}
                        </div>
                    </div>,
                    document.body
                )}

            {/* МОДАЛКА ПІСЛЯ УСПІШНОГО ЗАВАНТАЖЕННЯ */}
            {mounted &&
                showThanksModal &&
                createPortal(
                    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#111] p-8 text-center shadow-2xl">
                            <button
                                onClick={() => setShowThanksModal(false)}
                                aria-label="Закрити"
                                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white flex items-center justify-center transition-colors"
                            >
                                <X className="w-4 h-4" strokeWidth={2.5} />
                            </button>

                            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
                                <Check className="w-6 h-6 text-green-400" strokeWidth={3} />
                            </div>

                            <p
                                className="text-white font-bold mb-2"
                                style={{ fontFamily: "'Unbounded', sans-serif", fontSize: "15px" }}
                            >
                                Договір завантажено
                            </p>
                            <p className="text-sm text-white/50 leading-relaxed mb-6">
                                Можете допомогти 79 ОШБр.
                                <br />
                                Хлопцям потрібна підтримка.
                            </p>

                            <MilitaryDonateButton onClick={handlePostDownloadDonateClick} />

                            <button
                                onClick={() => setShowThanksModal(false)}
                                className="mt-3 text-xs text-white/30 hover:text-white/50 transition-colors"
                            >
                                Нехай іншим разом
                            </button>
                        </div>
                    </div>,
                    document.body
                )}
        </main>
    );
}