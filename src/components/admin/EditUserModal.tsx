// EditUserModal.tsx
"use client";

import { Dialog } from "@headlessui/react";

interface Props {
    isOpen: boolean;
    user: { id: string; subscription: string } | null;
    subscriptionOptions: string[];
    onClose: () => void;
    onSave: (newSubscription: string) => void;
}

export default function EditUserModal({ isOpen, user, subscriptionOptions, onClose, onSave }: Props) {
    if (!user) return null;

    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed z-[100] inset-0 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center px-4 bg-black/70">
                <Dialog.Panel className="bg-gray-900 rounded-lg shadow-lg w-full max-w-md p-6 border border-gray-700">
                    <Dialog.Title className="text-lg font-medium text-gray-200 mb-4">
                        Редагувати користувача
                    </Dialog.Title>
                    <p className="text-sm text-gray-400 mb-4 break-all">
                        User ID: <span className="font-mono">{user.id}</span>
                    </p>
                    <label className="block mb-4 text-gray-300">
                        <span className="block text-sm mb-1">Підписка</span>
                        <select
                            defaultValue={user.subscription}
                            onChange={(e) => onSave(e.target.value)}
                            className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
                        >
                            {subscriptionOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </label>
                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
                        >
                            Скасувати
                        </button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
