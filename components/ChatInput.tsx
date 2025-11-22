"use client";

import React, { useState } from 'react';
import { Send, Mic } from 'lucide-react';
import clsx from 'clsx';

interface ChatInputProps {
    onSend: (text: string) => void;
    placeholder?: string;
    isSearchMode?: boolean;
    onToggleMode?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    onSend,
    placeholder = 'write your question to ai chatbot here',
    isSearchMode = false,
    onToggleMode
}) => {
    const [text, setText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onSend(text);
            setText('');
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="fixed bottom-[80px] left-0 w-full px-4 pb-2 pt-4 z-20 bg-gradient-to-t from-sam-dark via-sam-dark to-transparent"
        >
            {/* Mode Toggle (Optional) */}
            {onToggleMode && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-2 bg-black/40 backdrop-blur-md p-1 rounded-full border border-white/10">
                    <button
                        type="button"
                        onClick={() => isSearchMode && onToggleMode()}
                        className={clsx(
                            "px-3 py-1 rounded-full text-xs font-medium transition-all",
                            !isSearchMode ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"
                        )}
                    >
                        Log
                    </button>
                    <button
                        type="button"
                        onClick={() => !isSearchMode && onToggleMode()}
                        className={clsx(
                            "px-3 py-1 rounded-full text-xs font-medium transition-all",
                            isSearchMode ? "bg-sam-blue text-white" : "text-gray-400 hover:text-white"
                        )}
                    >
                        Search
                    </button>
                </div>
            )}

            <div className="max-w-md mx-auto w-full flex items-center gap-3">
                <div className="flex-1 relative group">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={isSearchMode ? "Ask about your history..." : placeholder}
                        className={clsx(
                            "w-full border rounded-full py-4 pl-6 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/10 shadow-lg transition-all",
                            isSearchMode
                                ? "bg-sam-blue/10 border-sam-blue/30 focus:border-sam-blue/50"
                                : "bg-[#2A2A2A] border-white/5"
                        )}
                    />
                    <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        aria-label="Voice Input"
                    >
                        <Mic size={20} />
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={!text.trim()}
                    className={clsx(
                        "flex-none w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all transform active:scale-95",
                        !text.trim()
                            ? "bg-[#1E3A8A]/50 cursor-not-allowed opacity-50"
                            : "bg-[#1E3A8A] hover:bg-blue-800 hover:scale-105"
                    )}
                    aria-label="Send Message"
                >
                    <Send size={20} className="ml-0.5" />
                </button>
            </div>
        </form>
    );
};
