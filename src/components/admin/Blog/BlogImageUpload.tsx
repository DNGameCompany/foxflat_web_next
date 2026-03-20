"use client";

import { useState, useRef } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

interface Props {
    value?: string;
    onChange: (url: string) => void;
}

export default function BlogImageUpload({ value, onChange }: Props) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        if (!file.type.startsWith("image/")) {
            setError("Тільки зображення");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("Максимум 5 MB");
            return;
        }

        setError(null);
        setUploading(true);
        setProgress(0);

        const ext = file.name.split(".").pop();
        const filename = `blog/${Date.now()}.${ext}`;
        const storageRef = ref(storage, filename);
        const task = uploadBytesResumable(storageRef, file);

        task.on(
            "state_changed",
            (snap) => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
            (err) => { setError(err.message); setUploading(false); },
            async () => {
                const url = await getDownloadURL(task.snapshot.ref);
                onChange(url);
                setUploading(false);
                setProgress(0);
            }
        );
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    return (
        <div className="space-y-2">
            <p className="text-[11px] text-white/40">Cover image</p>

            {/* Прев'ю */}
            {value && (
                <div className="relative rounded-xl overflow-hidden border border-white/[0.07] group">
                    <img src={value} alt="cover" className="w-full h-32 object-cover opacity-80" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                            onClick={() => inputRef.current?.click()}
                            className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
                        >
                            Замінити
                        </button>
                        <button
                            onClick={() => onChange("")}
                            className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                        >
                            Видалити
                        </button>
                    </div>
                </div>
            )}

            {/* Drop zone */}
            {!value && (
                <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => inputRef.current?.click()}
                    className="relative rounded-xl border border-dashed border-white/[0.12] hover:border-orange-500/40 bg-white/[0.02] hover:bg-orange-500/[0.03] transition-all cursor-pointer p-6 text-center"
                >
                    {uploading ? (
                        <div className="space-y-2">
                            <p className="text-xs text-white/40">Завантаження... {progress}%</p>
                            <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-orange-500 transition-all duration-200 rounded-full"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="text-2xl mb-2 opacity-30">🖼</div>
                            <p className="text-[11px] text-white/30">
                                Перетягни або <span className="text-orange-400">обери файл</span>
                            </p>
                            <p className="text-[10px] text-white/15 mt-1">JPG, PNG, WebP · до 5 MB</p>
                        </>
                    )}
                </div>
            )}

            {error && <p className="text-[10px] text-red-400">{error}</p>}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleInput}
            />
        </div>
    );
}