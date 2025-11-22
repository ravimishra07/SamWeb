"use client";

import React, { useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { ChatStream } from '@/components/ChatStream';
import { ChatInput } from '@/components/ChatInput';
import { BottomNav } from '@/components/BottomNav';
import { useAppData } from '@/context/AppDataContext';
import { useChatFlow } from '@/hooks/useChatFlow';

export default function Home() {
  const { chatHistory } = useAppData();
  const { currentStep, handleInput, isFlowActive } = useChatFlow();

  // Auto-scroll to bottom when chat history changes
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  return (
    <>
      <Header title="ChatAI" />

      <main className="flex-1 flex flex-col relative overflow-hidden bg-sam-dark">
        {/* Chat Area */}
        <div className="flex-1 relative min-h-0 pb-24">
          <ChatStream messages={chatHistory} />
          <div ref={bottomRef} />
        </div>

        {/* Dynamic Input Area */}
        {isFlowActive && (
          <ChatInput
            onSend={handleInput}
            mode={currentStep.type === 'slider' ? 'slider' : 'text'}
            sliderConfig={currentStep.type === 'slider' ? {
              min: currentStep.min || 1,
              max: currentStep.max || 10,
              label: currentStep.question,
              value: 5 // Default value, could be state managed if needed
            } : undefined}
          />
        )}

        {!isFlowActive && (
          <div className="fixed bottom-20 w-full text-center text-gray-500 text-sm">
            Daily log complete. Check Profile for JSON.
          </div>
        )}
      </main>

      <BottomNav />
    </>
  );
}
