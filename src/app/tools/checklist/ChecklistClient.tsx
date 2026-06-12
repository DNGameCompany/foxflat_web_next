"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import HeaderFoxFlat from "@/src/components/HeaderFoxFlat";

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconDoc = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/>
    </svg>
);
const IconHome = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9.5z"/><path d="M9 21V12h6v9"/>
    </svg>
);
const IconZap = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
);
const IconLayers = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
    </svg>
);
const IconBuilding = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 21V9"/><rect x="12" y="13" width="3" height="3"/><rect x="12" y="6" width="3" height="2"/><rect x="6" y="6" width="3" height="2"/><rect x="6" y="13" width="3" height="3"/>
    </svg>
);
const IconContract = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
    </svg>
);
const IconTelegram = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.2-.04-.28-.02-.12.02-1.96 1.25-5.54 3.66-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.25.38-.51 1.07-.78 4.19-1.82 6.98-3.02 8.38-3.6 3.99-1.66 4.82-1.95 5.36-1.96.12 0 .38.03.55.17.14.12.18.28.2.45-.02.06-.02.13-.03.2z"/>
    </svg>
);
const IconArrow = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const IconShield = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
);
const IconAlert = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
);
const IconDownload = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
);
const IconUpload = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
);

// ─── Data ────────────────────────────────────────────────────────────────────

const SECTIONS = [
    {
        id: "docs",
        Icon: IconDoc,
        title: "Документи",
        items: [
            { id: "d1", text: "Паспорт власника збігається з договором", critical: true },
            { id: "d2", text: "Перевірено витяг з реєстру прав власності", critical: true },
            { id: "d3", text: "Квартира не під арештом і не в заставі", critical: true },
            { id: "d4", text: "Власник один — або присутні всі співвласники", critical: true },
            { id: "d5", text: "Немає боргів за комунальні (попросіть квитанції)", critical: false },
            { id: "d6", text: "Дізнались про наявність прописаних осіб", critical: false },
        ],
    },
    {
        id: "space",
        Icon: IconHome,
        title: "Приміщення",
        items: [
            { id: "s1", text: "Стіни та стеля — без цвілі, підтікань, тріщин", critical: true },
            { id: "s2", text: "Підлога — рівна, без скрипу і відшарувань", critical: false },
            { id: "s3", text: "Вікна та підвіконня — без зазорів і конденсату", critical: false },
            { id: "s4", text: "Двері закриваються щільно, замки працюють", critical: false },
            { id: "s5", text: "Немає стороннього запаху (цигарки, сирість, тварини)", critical: false },
            { id: "s6", text: "Рівень шуму з вулиці і сусідів прийнятний", critical: false },
            { id: "s7", text: "Природне освітлення достатнє", critical: false },
        ],
    },
    {
        id: "utilities",
        Icon: IconZap,
        title: "Комунікації",
        items: [
            { id: "u1", text: "Електрика — всі розетки і вимикачі в робочому стані", critical: true },
            { id: "u2", text: "Водопостачання — тиск є, немає патьоків під раковиною", critical: true },
            { id: "u3", text: "Каналізація — зливи не засмічені, немає запаху", critical: true },
            { id: "u4", text: "Газ (якщо є) — кран перекривається, немає запаху", critical: true },
            { id: "u5", text: "Опалення — радіатори рівномірно гріють", critical: false },
            { id: "u6", text: "Бойлер / колонка — перевірили температуру гарячої води", critical: false },
            { id: "u7", text: "Лічильники наявні і зафіксовані показники", critical: false },
            { id: "u8", text: "Інтернет — перевірили швидкість або дізнались провайдера", critical: false },
        ],
    },
    {
        id: "appliances",
        Icon: IconLayers,
        title: "Техніка та меблі",
        items: [
            { id: "a6", text: "Зробили фото/відео всієї техніки і меблів", critical: true },
            { id: "a1", text: "Холодильник — увімкнений і охолоджує", critical: false },
            { id: "a2", text: "Пральна машина — запустили тест-цикл", critical: false },
            { id: "a3", text: "Плита / духовка — всі конфорки працюють", critical: false },
            { id: "a4", text: "Кондиціонер — увімкнули, дує холодним / теплим", critical: false },
            { id: "a5", text: "Меблі — без серйозних пошкоджень, ящики відкриваються", critical: false },
        ],
    },
    {
        id: "building",
        Icon: IconBuilding,
        title: "Будинок і двір",
        items: [
            { id: "b1", text: "Є укриття або підвал поряд", critical: true },
            { id: "b2", text: "Під'їзд і ліфт у нормальному стані", critical: false },
            { id: "b3", text: "Паркінг або місце для авто (якщо потрібно)", critical: false },
            { id: "b4", text: "Найближча зупинка / метро в межах комфортної ходьби", critical: false },
            { id: "b5", text: "Магазини, аптека, школа поруч", critical: false },
            { id: "b6", text: "Сусіди не викликають підозр (поговорили в під'їзді)", critical: false },
        ],
    },
    {
        id: "contract",
        Icon: IconContract,
        title: "Умови договору",
        items: [
            { id: "c1", text: "Ціна оренди зафіксована і не може змінюватись в односторонньому порядку", critical: true },
            { id: "c2", text: "Умови повернення застави прописані чітко", critical: true },
            { id: "c3", text: "Строк оренди і умови дострокового розірвання вказані", critical: true },
            { id: "c5", text: "Підписали Акт прийому-передачі з описом майна", critical: true },
            { id: "c6", text: "Отримали копію договору на руки", critical: true },
            { id: "c4", text: "Хто платить за що (комунальні, ремонт) — розписано", critical: false },
        ],
    },
];

// Унікальний маркер FoxFlat для ідентифікації PDF
const FOXFLAT_MARKER = "FOXFLAT_CHECKLIST_V1";

type Checked = Record<string, boolean>;

// ─── PDF Export ───────────────────────────────────────────────────────────────

async function exportToPdf(checked: Checked) {
    const { jsPDF } = await import("jspdf");

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    // ── Завантаження шрифту Roboto для підтримки кирилиці ──
    // Використовуємо лише Roboto-Regular для всього тексту (bold викликає fallback на helvetica без кирилиці)
    let robotoLoaded = false;
    try {
        const response = await fetch("/fonts/Roboto-Regular.ttf");
        if (!response.ok) throw new Error("Font not found");
        const blob = await response.blob();
        const reader = new FileReader();
        await new Promise<void>((resolve, reject) => {
            reader.onloadend = () => resolve();
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
        const fontBase64 = (reader.result as string).split(",")[1];
        doc.addFileToVFS("Roboto-Regular.ttf", fontBase64);
        doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
        // Реєструємо той самий файл як "bold" — щоб виклики setFont("Roboto","bold") не падали
        doc.addFont("Roboto-Regular.ttf", "Roboto", "bold");
        robotoLoaded = true;
    } catch (e) {
        console.warn("Roboto font not found, falling back to helvetica. Cyrillic may not render.", e);
    }

    // Хелпер для встановлення шрифту
    const setFont = (style: "normal" | "bold" = "normal") => {
        if (robotoLoaded) {
            doc.setFont("Roboto", style);
        } else {
            doc.setFont("helvetica", style);
        }
    };

    const W = 210;
    const MARGIN = 16;
    const contentW = W - MARGIN * 2;
    let y = 0;

    // ── Кольори ──
    const BG        = [15, 15, 15]   as [number, number, number];
    const CARD      = [24, 24, 24]   as [number, number, number];
    const ORANGE    = [249, 115, 22] as [number, number, number];
    const WHITE     = [255, 255, 255] as [number, number, number];
    const DIM       = [120, 120, 120] as [number, number, number];
    const DIMMER    = [60, 60, 60]   as [number, number, number];
    const RED_BG    = [40, 20, 20]   as [number, number, number];
    const RED_TEXT  = [220, 80, 80]  as [number, number, number];
    const GREEN_BG  = [20, 40, 20]   as [number, number, number];
    const GREEN_TEXT= [80, 200, 120] as [number, number, number];

    const allItemIds   = SECTIONS.flatMap(s => s.items.map(i => i.id));
    const doneCount    = allItemIds.filter(id => checked[id]).length;
    const totalItems   = allItemIds.length;
    const totalPct     = Math.round((doneCount / totalItems) * 100);
    const criticalIds  = SECTIONS.flatMap(s => s.items.filter(i => i.critical).map(i => i.id));
    const criticalDone = criticalIds.filter(id => checked[id]).length;
    const allCritical  = criticalDone === criticalIds.length;

    const pageH = 297;

    const newPage = () => {
        doc.addPage();
        // фон
        doc.setFillColor(...BG);
        doc.rect(0, 0, W, pageH, "F");
        y = MARGIN;
    };

    const ensureSpace = (needed: number) => {
        if (y + needed > pageH - MARGIN) newPage();
    };

    // ── Сторінка 1: фон ──
    doc.setFillColor(...BG);
    doc.rect(0, 0, W, pageH, "F");
    y = MARGIN;

    const now = new Date();
    const dateStr = now.toLocaleDateString("uk-UA", { day: "2-digit", month: "2-digit", year: "numeric" });

    // ── Header: логотип + бренд-пілюля + дата ──
    const LOGO_SIZE = 14;
    try {
        const logoResp = await fetch("/images/logo.png");
        if (logoResp.ok) {
            const logoBlob = await logoResp.blob();
            const logoReader = new FileReader();
            await new Promise<void>((res, rej) => {
                logoReader.onloadend = () => res();
                logoReader.onerror = rej;
                logoReader.readAsDataURL(logoBlob);
            });
            const logoBase64 = logoReader.result as string;
            doc.addImage(logoBase64, "PNG", MARGIN, y, LOGO_SIZE, LOGO_SIZE);
        }
    } catch {
        // Логотип не знайдено — пропускаємо
    }

    // Бренд-пілюля праворуч від логотипу
    const brandX = MARGIN + LOGO_SIZE + 3;
    doc.setFillColor(...ORANGE);
    doc.roundedRect(brandX, y + 3, 28, 8, 2, 2, "F");
    setFont("bold");
    doc.setFontSize(7);
    doc.setTextColor(...BG);
    doc.text("FOXFLAT", brandX + 14, y + 8.2, { align: "center" });

    // Дата — праворуч
    setFont("normal");
    doc.setFontSize(7);
    doc.setTextColor(...DIM);
    doc.text(`Згенеровано ${dateStr}`, W - MARGIN, y + 8.2, { align: "right" });

    y += LOGO_SIZE + 8; // більший відступ після шапки

    // Заголовок
    setFont("bold");
    doc.setFontSize(20);
    doc.setTextColor(...WHITE);
    doc.text("Чеклист огляду квартири", MARGIN, y);
    y += 8;

    setFont("normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...DIM);
    doc.text("Перевірте кожен пункт перед підписанням договору оренди", MARGIN, y);
    y += 12;

    // ── Розділювач ──
    doc.setDrawColor(...DIMMER);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, y, W - MARGIN, y);
    y += 8;

    // ── Прогрес картка ──
    const progressCardH = 22;
    doc.setFillColor(...CARD);
    doc.roundedRect(MARGIN, y, contentW, progressCardH, 3, 3, "F");
    doc.setDrawColor(...ORANGE);
    doc.setLineWidth(0.4);
    doc.roundedRect(MARGIN, y, contentW, progressCardH, 3, 3, "S");

    setFont("bold");
    doc.setFontSize(16);
    doc.setTextColor(...ORANGE);
    doc.text(`${totalPct}%`, MARGIN + 6, y + 13);

    setFont("normal");
    doc.setFontSize(8);
    doc.setTextColor(...WHITE);
    doc.text(`Виконано ${doneCount} з ${totalItems} пунктів`, MARGIN + 22, y + 10);

    doc.setFontSize(7);
    doc.setTextColor(...DIM);
    doc.text(`Критичні: ${criticalDone}/${criticalIds.length}`, MARGIN + 22, y + 16);

    const barX = MARGIN + contentW - 70;
    const barW = 62;
    const barY = y + 10;
    doc.setFillColor(...DIMMER);
    doc.roundedRect(barX, barY, barW, 3, 1, 1, "F");
    if (totalPct > 0) {
        doc.setFillColor(...ORANGE);
        doc.roundedRect(barX, barY, barW * totalPct / 100, 3, 1, 1, "F");
    }

    y += progressCardH + 6;

    // ── Critical summary — ВГОРІ, одразу після прогресу ──
    const summaryH = 22;
    if (allCritical) {
        doc.setFillColor(...GREEN_BG);
        doc.setDrawColor(...GREEN_TEXT);
    } else {
        doc.setFillColor(...RED_BG);
        doc.setDrawColor(...RED_TEXT);
    }
    doc.setLineWidth(0.4);
    doc.roundedRect(MARGIN, y, contentW, summaryH, 3, 3, "FD");

    setFont("bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...(allCritical ? GREEN_TEXT : RED_TEXT));
    doc.text(
        allCritical
            ? `Критичні пункти виконано: ${criticalDone}/${criticalIds.length}`
            : `Критичних пунктів не виконано: ${criticalIds.length - criticalDone}`,
        MARGIN + 5, y + 9
    );

    setFont("normal");
    doc.setFontSize(7);
    doc.setTextColor(...DIM);
    const summaryText = allCritical
        ? "Всi обов'язкові пункти виконано. Можна переходити до підписання договору."
        : "Не підписуй договір, поки не перевірив всі пункти з позначкою «критично».";
    doc.text(summaryText, MARGIN + 5, y + 17);

    y += summaryH + 8;

    // ── Секції ──
    for (const section of SECTIONS) {
        const sectionDone  = section.items.filter(i => checked[i.id]).length;
        const sectionTotal = section.items.length;
        const sectionPct   = Math.round((sectionDone / sectionTotal) * 100);
        const complete     = sectionPct === 100;

        // Висота секції: header(14) + items(8 кожен) + padding(6)
        const sectionH = 14 + section.items.length * 8 + 6;
        ensureSpace(sectionH);

        // Картка секції
        doc.setFillColor(...CARD);
        doc.roundedRect(MARGIN, y, contentW, sectionH, 3, 3, "F");
        if (complete) {
            doc.setDrawColor(...ORANGE);
            doc.setLineWidth(0.4);
        } else {
            doc.setDrawColor(40, 40, 40);
            doc.setLineWidth(0.3);
        }
        doc.roundedRect(MARGIN, y, contentW, sectionH, 3, 3, "S");

        // Заголовок секції
        setFont("bold");
        doc.setFontSize(9);
        doc.setTextColor(...WHITE);
        doc.text(section.title, MARGIN + 5, y + 8);

        // % статус праворуч
        setFont("bold");
        doc.setFontSize(7.5);
        doc.setTextColor(complete ? ORANGE[0] : DIM[0], complete ? ORANGE[1] : DIM[1], complete ? ORANGE[2] : DIM[2]);
        doc.text(complete ? "Виконано" : `${sectionPct}%`, W - MARGIN - 5, y + 8, { align: "right" });

        // Лінія під заголовком
        doc.setDrawColor(40, 40, 40);
        doc.setLineWidth(0.2);
        doc.line(MARGIN + 5, y + 11, W - MARGIN - 5, y + 11);

        let itemY = y + 17;

        for (const item of section.items) {
            const isDone = !!checked[item.id];

            // Checkbox квадрат
            if (isDone) {
                doc.setFillColor(...ORANGE);
                doc.roundedRect(MARGIN + 5, itemY - 3.5, 4.5, 4.5, 0.8, 0.8, "F");
                // Галочка
                doc.setDrawColor(...BG);
                doc.setLineWidth(0.7);
                doc.line(MARGIN + 6.2, itemY - 1.3, MARGIN + 7, itemY - 0.2);
                doc.line(MARGIN + 7, itemY - 0.2, MARGIN + 8.8, itemY - 3.2);
            } else {
                doc.setDrawColor(70, 70, 70);
                doc.setFillColor(...CARD);
                doc.setLineWidth(0.3);
                doc.roundedRect(MARGIN + 5, itemY - 3.5, 4.5, 4.5, 0.8, 0.8, "FD");
            }

            // Текст пункту
            setFont("normal");
            doc.setFontSize(7.5);
            doc.setTextColor(
                isDone ? DIM[0] : WHITE[0],
                isDone ? DIM[1] : WHITE[1],
                isDone ? DIM[2] : WHITE[2]
            );

            const maxTextW = contentW - 18 - (item.critical && !isDone ? 18 : 0);
            const lines = doc.splitTextToSize(item.text, maxTextW);
            doc.text(lines[0], MARGIN + 12, itemY);

            // "критично" бейдж
            if (item.critical && !isDone) {
                doc.setFillColor(...RED_BG);
                doc.setDrawColor(...RED_TEXT);
                doc.setLineWidth(0.2);
                doc.roundedRect(W - MARGIN - 17, itemY - 3.5, 14, 4.5, 1, 1, "FD");
                setFont("bold");
                doc.setFontSize(5.5);
                doc.setTextColor(...RED_TEXT);
                doc.text("КРИТИЧНО", W - MARGIN - 10, itemY - 0.5, { align: "center" });
            }

            itemY += 8;
        }

        y += sectionH + 4;
    }

    ensureSpace(10);
    y += 4;

    // ── Footer ──
    doc.setDrawColor(...DIMMER);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, y, W - MARGIN, y);
    y += 5;

    setFont("normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...DIMMER);
    doc.text("foxflat.com.ua — Telegram-бот для пошуку квартир без посередників", MARGIN, y);
    doc.text(`${dateStr}`, W - MARGIN, y, { align: "right" });

    // ── Вбудовуємо стан чеклиста в metadata (Keywords) ──
    const stateJson = JSON.stringify(checked);
    const encoded   = btoa(encodeURIComponent(stateJson));
    doc.setProperties({
        title:    "FoxFlat — Чеклист огляду квартири",
        subject:  `${FOXFLAT_MARKER}:${encoded}`,
        author:   "FoxFlat",
        keywords: `foxflat,checklist,${FOXFLAT_MARKER}`,
        creator:  "foxflat.com.ua",
    });

    doc.save(`foxflat-checklist-${dateStr.replace(/\./g, "-")}.pdf`);
}

// ─── PDF Import ───────────────────────────────────────────────────────────────

async function importFromPdf(file: File): Promise<Checked | null> {
    try {
        const { PDFDocument } = await import("pdf-lib");
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc      = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const subject     = pdfDoc.getSubject() ?? "";

        if (!subject.startsWith(`${FOXFLAT_MARKER}:`)) return null;

        const encoded  = subject.slice(FOXFLAT_MARKER.length + 1);
        const stateJson = decodeURIComponent(atob(encoded));
        return JSON.parse(stateJson) as Checked;
    } catch {
        return null;
    }
}

// ─── CheckItem ────────────────────────────────────────────────────────────────

function CheckItem({
                       text, critical, checked, onToggle,
                   }: { id: string; text: string; critical: boolean; checked: boolean; onToggle: () => void }) {
    return (
        <motion.button
            layout
            onClick={onToggle}
            className={`w-full flex items-start gap-3 px-4 py-3.5 rounded-xl border text-left transition-all duration-200 ${
                checked
                    ? "bg-white/[0.03] border-white/[0.06]"
                    : "bg-transparent border-white/[0.04] hover:border-white/[0.09] hover:bg-white/[0.02]"
            }`}
        >
            <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                checked ? "bg-orange-500 border-orange-500" : "border-white/20"
            }`}>
                <AnimatePresence>
                    {checked && (
                        <motion.svg
                            key="check"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            width="11" height="9" viewBox="0 0 11 9" fill="none"
                        >
                            <path d="M1 4.5L4 7.5L10 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </motion.svg>
                    )}
                </AnimatePresence>
            </div>

            <span className={`text-sm leading-relaxed transition-colors duration-200 flex-1 ${
                checked ? "text-white/25 line-through" : "text-white/70"
            }`}>
                {text}
            </span>

            {critical && !checked && (
                <span className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded border bg-red-500/10 border-red-500/20 text-red-400/80 mt-0.5 uppercase tracking-wider">
                    критично
                </span>
            )}
        </motion.button>
    );
}

// ─── SectionCard ──────────────────────────────────────────────────────────────

function SectionCard({
                         section, checked, onToggle,
                     }: { section: typeof SECTIONS[0]; checked: Checked; onToggle: (id: string) => void }) {
    const total    = section.items.length;
    const done     = section.items.filter(i => checked[i.id]).length;
    const pct      = Math.round((done / total) * 100);
    const complete = pct === 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className={`rounded-2xl border overflow-hidden transition-colors duration-300 ${
                complete
                    ? "border-orange-500/25 bg-orange-500/[0.03]"
                    : "border-white/[0.07] bg-white/[0.025]"
            }`}
        >
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border transition-colors duration-300 ${
                        complete
                            ? "bg-orange-500/15 border-orange-500/25 text-orange-400"
                            : "bg-white/[0.04] border-white/[0.07] text-white/40"
                    }`}>
                        <section.Icon />
                    </div>
                    <div>
                        <h2 className="font-black text-white leading-none" style={{ fontFamily: "'Unbounded', sans-serif", fontSize: "14px" }}>
                            {section.title}
                        </h2>
                        <p className="text-xs text-white/30 mt-1">{done} з {total} виконано</p>
                    </div>
                </div>

                <div className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors duration-300 ${
                    complete
                        ? "bg-orange-500/15 border-orange-500/25 text-orange-400"
                        : "bg-white/[0.04] border-white/[0.07] text-white/30"
                }`}>
                    {complete ? "Виконано" : `${pct}%`}
                </div>
            </div>

            <div className="mx-5 mb-4 h-px bg-white/[0.06] overflow-visible relative">
                <motion.div
                    className="absolute top-0 left-0 h-full bg-orange-500"
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                />
            </div>

            <div className="px-3 pb-4 space-y-1">
                {section.items.map(item => (
                    <CheckItem
                        key={item.id}
                        {...item}
                        checked={!!checked[item.id]}
                        onToggle={() => onToggle(item.id)}
                    />
                ))}
            </div>
        </motion.div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ChecklistClient() {
    const allItemIds  = SECTIONS.flatMap(s => s.items.map(i => i.id));
    const totalItems  = allItemIds.length;
    const criticalIds = SECTIONS.flatMap(s => s.items.filter(i => i.critical).map(i => i.id));

    const [checked, setChecked]         = useState<Checked>({});
    const [showReset, setShowReset]     = useState(false);
    const [exporting, setExporting]     = useState(false);
    const [importError, setImportError] = useState<string | null>(null);
    const [importSuccess, setImportSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        try {
            const saved = localStorage.getItem("foxflat-checklist");
            if (saved) setChecked(JSON.parse(saved));
        } catch {}
    }, []);

    useEffect(() => {
        try { localStorage.setItem("foxflat-checklist", JSON.stringify(checked)); } catch {}
    }, [checked]);

    const toggle = (id: string) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));

    const doneCount    = allItemIds.filter(id => checked[id]).length;
    const totalPct     = Math.round((doneCount / totalItems) * 100);
    const criticalDone = criticalIds.filter(id => checked[id]).length;
    const allCritical  = criticalDone === criticalIds.length;

    const handleExport = async () => {
        setExporting(true);
        try {
            await exportToPdf(checked);
        } finally {
            setExporting(false);
        }
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImportError(null);
        setImportSuccess(false);

        const result = await importFromPdf(file);
        if (result) {
            setChecked(result);
            setImportSuccess(true);
            setTimeout(() => setImportSuccess(false), 3000);
        } else {
            setImportError("Файл не є чеклистом FoxFlat або пошкоджений.");
            setTimeout(() => setImportError(null), 4000);
        }
        // скидаємо input щоб можна було завантажити той самий файл знову
        e.target.value = "";
    };

    return (
        <main className="relative min-h-screen bg-[#0f0f0f] text-white overflow-hidden">
            <HeaderFoxFlat />
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute left-1/2 top-[-5%] h-[600px] w-[700px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-3xl" />
            </div>

            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-24 sm:py-32">

                {/* ── Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10"
                >
                    <p className="text-xs font-bold tracking-widest text-orange-500 uppercase mb-4">Інструменти</p>
                    <h1
                        className="font-black mb-4 leading-tight text-white"
                        style={{ fontFamily: "'Unbounded', sans-serif", fontSize: "clamp(26px, 3.5vw, 42px)", letterSpacing: "-1px" }}
                    >
                        Чеклист огляду квартири
                    </h1>
                    <p className="text-white/40 text-base max-w-lg mx-auto leading-relaxed">
                        Відкрий під час перегляду і не пропустиш жодного важливого пункту. Прогрес зберігається автоматично.
                    </p>
                </motion.div>

                {/* ── тонкий розділювач ── */}
                <div className="max-w-4xl mx-auto mb-10">
                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>

                {/* ── Sticky progress + PDF actions ── */}
                <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 bg-[#0f0f0f]/80 backdrop-blur-md border-b border-white/[0.05] mb-10">
                    <div className="max-w-5xl mx-auto flex items-center gap-4">
                        {/* Progress bar */}
                        <div className="flex-1 h-px bg-white/[0.08] overflow-visible relative">
                            <motion.div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-600 to-orange-400"
                                animate={{ width: `${totalPct}%` }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                            />
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <span className="text-sm font-black tabular-nums text-white" style={{ fontFamily: "'Unbounded', sans-serif" }}>
                                {doneCount}<span className="text-white/20">/{totalItems}</span>
                            </span>

                            {/* PDF Import */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                onChange={handleImport}
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                title="Завантажити збережений чеклист PDF"
                                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-white/[0.07] text-white/35 hover:text-white/60 hover:border-white/15 transition-all"
                            >
                                <IconUpload />
                                <span className="hidden sm:inline">Імпорт PDF</span>
                            </button>

                            {/* PDF Export */}
                            <button
                                onClick={handleExport}
                                disabled={exporting}
                                title="Зберегти чеклист як PDF"
                                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-orange-500/30 text-orange-400/70 hover:text-orange-400 hover:border-orange-500/50 transition-all disabled:opacity-40"
                            >
                                <IconDownload />
                                <span className="hidden sm:inline">{exporting ? "Генерація..." : "Зберегти PDF"}</span>
                            </button>

                            {/* Reset */}
                            <AnimatePresence>
                                {doneCount > 0 && (
                                    <motion.button
                                        key="reset"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        onClick={() => setShowReset(true)}
                                        className="text-xs font-bold px-3 py-1.5 rounded-lg border border-white/[0.07] text-white/25 hover:text-white/50 hover:border-white/15 transition-all"
                                    >
                                        Скинути
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Notification bar */}
                    <AnimatePresence>
                        {(importSuccess || importError) && (
                            <motion.p
                                key="notif"
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className={`text-center text-xs font-bold mt-2 ${importSuccess ? "text-green-400" : "text-red-400"}`}
                            >
                                {importSuccess ? "Прогрес відновлено з PDF" : importError}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>

                {/* ── Sections grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10">
                    {SECTIONS.map(section => (
                        <SectionCard
                            key={section.id}
                            section={section}
                            checked={checked}
                            onToggle={toggle}
                        />
                    ))}
                </div>

                {/* ── тонкий розділювач ── */}
                <div className="max-w-4xl mx-auto my-10">
                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>

                {/* ── Critical summary ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={`rounded-2xl border p-6 mb-4 transition-colors duration-500 ${
                        allCritical
                            ? "border-orange-500/25 bg-orange-500/[0.04]"
                            : "border-white/[0.07] bg-white/[0.025]"
                    }`}
                >
                    <div className="flex items-start gap-4">
                        <div className={`p-2.5 rounded-xl border flex-shrink-0 transition-colors duration-500 ${
                            allCritical
                                ? "bg-orange-500/15 border-orange-500/25 text-orange-400"
                                : "bg-white/[0.04] border-white/[0.07] text-white/30"
                        }`}>
                            {allCritical ? <IconShield /> : <IconAlert />}
                        </div>
                        <div className="flex-1">
                            <p
                                className={`text-sm font-bold mb-1.5 transition-colors duration-500 ${allCritical ? "text-orange-400" : "text-white/70"}`}
                                style={{ fontFamily: "'Unbounded', sans-serif" }}
                            >
                                Критичні пункти: {criticalDone} / {criticalIds.length}
                            </p>
                            <p className="text-sm text-white/40 leading-relaxed">
                                {allCritical
                                    ? "Всі обов'язкові пункти виконано. Можна переходити до підписання договору."
                                    : "Не підписуй договір, поки не перевірив усі пункти з позначкою «критично». Це захистить від фінансових та юридичних ризиків."}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* ── PDF hint ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 mb-4 flex items-start gap-4"
                >
                    <div className="p-2.5 rounded-xl border bg-white/[0.04] border-white/[0.07] text-white/40 flex-shrink-0">
                        <IconDownload />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-white/70 mb-1" style={{ fontFamily: "'Unbounded', sans-serif" }}>
                            Збережи та повернись пізніше
                        </p>
                        <p className="text-sm text-white/35 leading-relaxed">
                            Зберігай PDF після кожного огляду — він містить твій прогрес. Завантаж збережений файл назад на сторінку і продовж відмічати з того місця, де зупинився.
                        </p>
                    </div>
                    <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="shrink-0 flex items-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs text-white/60 border border-white/[0.08] hover:text-white hover:border-white/20 transition-all disabled:opacity-40"
                    >
                        <IconDownload />
                        {exporting ? "..." : "PDF"}
                    </button>
                </motion.div>

                {/* ── CTA ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-5 overflow-hidden"
                >
                    <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 100% 100%, rgba(249,115,22,0.07) 0%, transparent 60%)" }} />
                    <div className="relative flex-1">
                        <p className="text-sm font-bold text-white mb-1.5" style={{ fontFamily: "'Unbounded', sans-serif" }}>
                            Шукаєш квартиру?
                        </p>
                        <p className="text-sm text-white/40 leading-relaxed">
                            FoxFlat моніторить OLX і DOM.RIA кожні 15 хвилин і надсилає нові оголошення напряму в Telegram.
                        </p>
                    </div>
                    <a
                        href="https://t.me/FoxFlat_bot?start=checklist"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative shrink-0 inline-flex items-center gap-2 py-3 px-6 rounded-xl font-bold text-xs text-black bg-orange-500 hover:bg-transparent hover:text-orange-500 border-2 border-orange-500 transition-all duration-200"
                        style={{ fontFamily: "'Unbounded', sans-serif" }}
                    >
                        <IconTelegram />
                        Відкрити FoxFlat
                        <IconArrow />
                    </a>
                </motion.div>

                {/* ── Related links ── */}
                <div className="flex flex-wrap gap-2 justify-center">
                    <p className="w-full text-center text-xs text-white/20 mb-2">Також корисно:</p>
                    {([
                        ["Калькулятор вартості оренди", "/tools/calculator"],
                        ["Блог про оренду",              "/blog"],
                    ] as [string, string][]).map(([label, href]) => (
                        <Link key={href} href={href} className="text-sm font-bold px-4 py-2 rounded-full border border-white/[0.08] text-white/30 hover:text-white/60 hover:border-white/20 transition-all">
                            {label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* ── Reset modal ── */}
            <AnimatePresence>
                {showReset && (
                    <motion.div
                        key="overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
                        onClick={() => setShowReset(false)}
                    >
                        <motion.div
                            key="modal"
                            initial={{ opacity: 0, scale: 0.92, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 20 }}
                            transition={{ duration: 0.2 }}
                            onClick={e => e.stopPropagation()}
                            className="w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#111] p-7 space-y-4"
                        >
                            <p className="font-black text-white text-base" style={{ fontFamily: "'Unbounded', sans-serif" }}>
                                Скинути прогрес?
                            </p>
                            <p className="text-sm text-white/40 leading-relaxed">
                                Всі відмітки будуть видалені. Дія не скасовується.
                            </p>
                            <div className="flex gap-3 pt-1">
                                <button
                                    onClick={() => setShowReset(false)}
                                    className="flex-1 py-3 rounded-xl border border-white/[0.08] text-white/40 text-sm font-bold hover:text-white/70 transition-colors"
                                >
                                    Скасувати
                                </button>
                                <button
                                    onClick={() => { setChecked({}); setShowReset(false); }}
                                    className="flex-1 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold hover:bg-red-500/20 transition-all"
                                >
                                    Скинути
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                @media (prefers-reduced-motion: reduce) {
                    * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
                }
            `}</style>
        </main>
    );
}