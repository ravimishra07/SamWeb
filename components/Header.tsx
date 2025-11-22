"use client";

import React, { useState } from 'react';
import { Menu, MoreVertical, Trash2 } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';

interface HeaderProps {
    title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title = "ChatAI" }) => {
    const { clearAllData } = useAppData();
    const [showMenu, setShowMenu] = useState(false);

    return (
        <header className="flex items-center justify-between px-6 py-4 z-10 bg-sam-dark/80 backdrop-blur-sm sticky top-0 relative">
            <button className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors" aria-label="Menu">
                <Menu size={24} />
            </button>
            <h1 className="text-xl font-medium tracking-wide text-white">{title}</h1>

            <div className="relative">
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors"
                    aria-label="Options"
                >
                    <MoreVertical size={24} />
                </button>

                {showMenu && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowMenu(false)}
                        />
                        <div className="absolute right-0 top-full mt-2 w-48 bg-sam-card backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in duration-200">
                            <button
                                onClick={() => {
                                    if (confirm('Clear all data? This will reset the app.')) {
                                        clearAllData();
                                    }
                                    setShowMenu(false);
                                }}
                                className="w-full px-4 py-3 text-left text-red-400 hover:bg-white/5 flex items-center gap-2 text-sm font-medium transition-colors"
                            >
                                <Trash2 size={16} />
                                Clear Data
                            </button>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
};
