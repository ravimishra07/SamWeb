import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { ChatMessage } from '../utils/mockData';

interface ChatStreamProps {
    messages: ChatMessage[];
}

export const ChatStream: React.FC<ChatStreamProps> = ({ messages }) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pb-24">
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
            <div ref={bottomRef} />
        </div>
    );
};
