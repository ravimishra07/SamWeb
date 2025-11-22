import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { ChatMessage } from '../utils/mockData';
import { MoodSlider } from './MoodSlider';
import { FlowStep } from '../utils/types';

interface ChatStreamProps {
    messages: ChatMessage[];
    isViewMode?: boolean;
    currentStep?: FlowStep;
    onInput?: (value: string | number) => void;
}

export const ChatStream: React.FC<ChatStreamProps> = ({ messages, isViewMode = false, currentStep, onInput }) => {
    const bottomRef = useRef<HTMLDivElement>(null);
    const [sliderValue, setSliderValue] = useState(5);

    // Reset slider value when step changes
    useEffect(() => {
        if (currentStep?.type === 'slider') {
            setSliderValue(currentStep.min || 1);
        }
    }, [currentStep]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, currentStep]);

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pb-32">
            {messages.map((msg) => {
                const isAssistant = msg.role === 'assistant';
                return (
                    <div
                        key={msg.id}
                        className={clsx(
                            "flex w-full",
                            isAssistant ? "justify-start" : "justify-end"
                        )}
                    >
                        <div
                            className={clsx(
                                "max-w-[85%] p-4 text-sm leading-relaxed shadow-md animate-in slide-in-from-bottom-2 fade-in duration-300",
                                isAssistant
                                    ? "bg-chat-gradient text-white rounded-tr-2xl rounded-tl-2xl rounded-br-2xl"
                                    : "bg-sam-gray text-gray-200 rounded-tr-2xl rounded-tl-2xl rounded-bl-2xl border border-white/5"
                            )}
                        >
                            {msg.content}
                        </div>
                    </div>
                );
            })}

            {/* Inline Slider Interaction */}
            {!isViewMode && currentStep?.type === 'slider' && onInput && (
                <div className="flex w-full justify-end animate-in slide-in-from-bottom-5 fade-in duration-500">
                    <div className="w-full max-w-sm">
                        <MoodSlider
                            value={sliderValue}
                            onChange={setSliderValue}
                            onSubmit={onInput}
                            min={currentStep.min}
                            max={currentStep.max}
                            label={currentStep.question}
                        />
                    </div>
                </div>
            )}

            <div ref={bottomRef} />
        </div>
    );
};
