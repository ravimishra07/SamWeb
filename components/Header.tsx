"use client";

import React, { useState } from "react";
import { Menu, MoreVertical, Trash2, Sun, Moon } from "lucide-react";
import { useAppData } from "@/context/AppDataContext";
import { motion } from "framer-motion";

interface HeaderProps {
    title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title = "ChatAI" }) => {
    const { clearAllData } = useAppData();
    const [showMenu, setShowMenu] = useState(false);
    const [darkMode, setDarkMode] = useState(true);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        if (typeof document !== "undefined") {
            document.documentElement.classList.toggle("dark", !darkMode);
        }
    };

    return (
        <header className="flex items-center justify-between px-6 h-16 bg-white/5 backdrop-blur-xl border-b border-white/5 sticky top-0 z-10 shadow-lg shadow-black/20">
            <button className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5" aria-label="Menu">
                <Menu size={24} />
            </button>
            <motion.h1
                className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
                whileHover={{ scale: 1.02 }}
            >
                {title}
            </motion.h1>
            <div className="flex items-center gap-2">
                {/* Dark mode toggle */}
                <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                    aria-label="Toggle dark mode"
                >
                    {darkMode ? <Moon size={20} /> : <Sun size={20} className="text-yellow-400" />}
                </button>
                {/* Options menu */}
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
                    aria-label="Options"
                >
                    <MoreVertical size={24} />
                </button>
                {showMenu && (
                    <>
                        <div className="fixed inset-0 z-20" onClick={() => setShowMenu(false)} />
                        <motion.div
                            className="absolute right-4 top-16 w-48 bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-30 overflow-hidden ring-1 ring-black/50"
                            initial={{ opacity: 0, scale: 0.9, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        >
                            <button
                                onClick={() => {
                                    if (confirm("Clear all data? This will reset the app.")) {
                                        clearAllData();
                                    }
                                    setShowMenu(false);
                                }}
                                className="w-full px-4 py-3 text-left text-red-400 hover:bg-white/5 flex items-center gap-3 text-sm font-medium transition-colors"
                            >
                                <Trash2 size={16} />
                                Clear Data
                            </button>
                        </motion.div>
                    </>
                )}
            </div>
        </header>
    );
};
