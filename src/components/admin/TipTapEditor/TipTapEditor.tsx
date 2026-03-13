// src/app/admin/components/TipTapEditor.tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { useEffect, useCallback } from "react";

interface Props {
    content: string;
    onChange: (html: string) => void;
}

type ButtonProps = {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
};

function ToolbarButton({ onClick, active, disabled, title, children }: ButtonProps) {
    return (
        <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); onClick(); }}
            disabled={disabled}
            title={title}
            className={`w-7 h-7 flex items-center justify-center rounded text-[12px] font-bold transition-all ${
                active
                    ? "bg-orange-500/20 text-orange-400 border border-orange-500/40"
                    : "text-white/40 hover:text-white/80 hover:bg-white/[0.06]"
            } disabled:opacity-25 disabled:cursor-not-allowed`}
        >
            {children}
        </button>
    );
}

function Divider() {
    return <div className="w-px h-5 bg-white/[0.08] mx-0.5" />;
}

export default function TipTapEditor({ content, onChange }: Props) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
                bulletList: { HTMLAttributes: { class: "tiptap-ul" } },
                orderedList: { HTMLAttributes: { class: "tiptap-ol" } },
                blockquote: { HTMLAttributes: { class: "tiptap-blockquote" } },
                codeBlock: { HTMLAttributes: { class: "tiptap-codeblock" } },
                code: { HTMLAttributes: { class: "tiptap-code" } },
                horizontalRule: {},
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: "tiptap-link", rel: "noopener noreferrer" },
            }),
            Image.configure({
                HTMLAttributes: { class: "tiptap-image" },
            }),
            Placeholder.configure({
                placeholder: "Починай писати статтю...",
            }),
            CharacterCount,
        ],
        content: content || "",
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "tiptap-editor focus:outline-none min-h-[400px] p-5",
            },
        },
    });

    // Синхронізуємо зовнішній content (напр. при редагуванні існуючої статті)
    useEffect(() => {
        if (!editor) return;
        if (editor.getHTML() !== content) {
            editor.commands.setContent(content || "");
        }
    }, [editor, content]);

    const setLink = useCallback(() => {
        if (!editor) return;
        const prev = editor.getAttributes("link").href ?? "";
        const url = window.prompt("URL посилання", prev);
        if (url === null) return;
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
        } else {
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        }
    }, [editor]);

    const addImage = useCallback(() => {
        if (!editor) return;
        const url = window.prompt("URL зображення");
        if (url) editor.chain().focus().setImage({ src: url }).run();
    }, [editor]);

    if (!editor) return null;

    const words = editor.storage.characterCount?.words() ?? 0;
    const chars = editor.storage.characterCount?.characters() ?? 0;
    const readTime = Math.max(1, Math.round(words / 200));

    return (
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">

            {/* Тулбар */}
            <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-white/[0.05] bg-white/[0.01]">

                {/* Заголовки */}
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                               active={editor.isActive("heading", { level: 1 })} title="Заголовок H1">
                    H1
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                               active={editor.isActive("heading", { level: 2 })} title="Заголовок H2">
                    H2
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                               active={editor.isActive("heading", { level: 3 })} title="Заголовок H3">
                    H3
                </ToolbarButton>

                <Divider />

                {/* Форматування */}
                <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()}
                               active={editor.isActive("bold")} title="Жирний (Ctrl+B)">
                    <strong>B</strong>
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()}
                               active={editor.isActive("italic")} title="Курсив (Ctrl+I)">
                    <em>I</em>
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()}
                               active={editor.isActive("underline")} title="Підкреслення (Ctrl+U)">
                    <span className="underline">U</span>
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()}
                               active={editor.isActive("strike")} title="Закреслення">
                    <span className="line-through">S</span>
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()}
                               active={editor.isActive("code")} title="Інлайн код">
                    {"<>"}
                </ToolbarButton>

                <Divider />

                {/* Списки */}
                <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()}
                               active={editor.isActive("bulletList")} title="Маркований список">
                    ≡
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()}
                               active={editor.isActive("orderedList")} title="Нумерований список">
                    1≡
                </ToolbarButton>

                <Divider />

                {/* Блоки */}
                <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()}
                               active={editor.isActive("blockquote")} title="Цитата">
                    &#34;
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                               active={editor.isActive("codeBlock")} title="Блок коду">
                    {"{}"}
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()}
                               title="Розділювач">
                    —
                </ToolbarButton>

                <Divider />

                {/* Посилання і зображення */}
                <ToolbarButton onClick={setLink} active={editor.isActive("link")} title="Посилання">
                    🔗
                </ToolbarButton>
                <ToolbarButton onClick={addImage} title="Зображення">
                    🖼
                </ToolbarButton>

                <Divider />

                {/* Відміна */}
                <ToolbarButton onClick={() => editor.chain().focus().undo().run()}
                               disabled={!editor.can().undo()} title="Відмінити (Ctrl+Z)">
                    ↩
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().redo().run()}
                               disabled={!editor.can().redo()} title="Повторити (Ctrl+Y)">
                    ↪
                </ToolbarButton>

                {/* Статистика */}
                <div className="ml-auto flex items-center gap-3 text-[10px] text-white/20">
                    <span>{words} сл.</span>
                    <span>{chars} симв.</span>
                    <span>~{readTime} хв</span>
                </div>
            </div>

            {/* Редактор */}
            <EditorContent editor={editor} />
        </div>
    );
}