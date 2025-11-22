"use client";

import React, { useState } from 'react';
import { Send, Mic } from 'lucide-react';
import clsx from 'clsx';

interface ChatInputProps {
    onSend: (text: string) => void;
    placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    onSend,
    placeholder = 'write your question to ai chatbot here',
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
            className="fixed bottom-0 left-0 w-full px-4 pb-6 pt-4 z-20 bg-gradient-to-t from-sam-dark via-sam-dark to-transparent"
        >
            <div className="max-w-md mx-auto w-full flex items-center gap-3">
                <div className="flex-1 relative group">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={placeholder}
                        className="w-full bg-[#2A2A2A] border border-white/5 rounded-full py-4 pl-6 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/10 shadow-lg transition-all"
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
