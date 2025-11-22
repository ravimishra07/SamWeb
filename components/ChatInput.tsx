"use client";

import React, { useState, useEffect } from 'react';
import { Send, Mic } from 'lucide-react';
import { MoodSlider } from './MoodSlider';
import clsx from 'clsx';

interface ChatInputProps {
    onSend: (text: string | number) => void;
    mode?: 'text' | 'slider';
    sliderConfig?: {
        min: number;
        max: number;
        label: string;
        value: number;
    };
}

export const ChatInput: React.FC<ChatInputProps> = ({
    onSend,
    mode = 'text',
    sliderConfig
}) => {
    const [text, setText] = useState('');
    const [sliderValue, setSliderValue] = useState(sliderConfig?.min || 1);

    useEffect(() => {
        if (mode === 'slider' && sliderConfig) {
            setSliderValue(sliderConfig.value || sliderConfig.min);
        }
    }, [mode, sliderConfig]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'text') {
            if (text.trim()) {
                onSend(text);
                setText('');
            }
        } else {
            onSend(sliderValue);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="fixed bottom-0 left-0 w-full px-4 pb-6 pt-4 z-20 bg-gradient-to-t from-sam-dark via-sam-dark to-transparent"
        >
            <div className="relative flex items-center justify-center max-w-md mx-auto w-full">
                {mode === 'text' ? (
                    <>
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="write your question to ai chatbot here"
                            className="w-full bg-sam-card backdrop-blur-md border border-white/10 rounded-full py-4 pl-6 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-sam-blue-DEFAULT/50 shadow-lg transition-all"
                        />
                        <button
                            type="button"
                            className="absolute right-16 text-gray-400 hover:text-white transition-colors"
                            aria-label="Voice Input"
                        >
                            <Mic size={20} />
                        </button>
                    </>
                ) : (
                    <div className="w-full bg-sam-card backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-lg animate-in slide-in-from-bottom-5 duration-300">
                        <MoodSlider
                            value={sliderValue}
                            onChange={setSliderValue}
                            min={sliderConfig?.min}
                            max={sliderConfig?.max}
                            label={sliderConfig?.label}
                        />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={mode === 'text' && !text.trim()}
                    className={clsx(
                        "absolute right-2 w-10 h-10 bg-sam-blue-DEFAULT rounded-full flex items-center justify-center text-white shadow-lg hover:bg-sam-blue-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95",
                        mode === 'slider' ? "bottom-4 right-4" : ""
                    )}
                    aria-label="Send Message"
                >
                    <Send size={18} className="ml-0.5" />
                </button>
            </div>
        </form>
    );
};
