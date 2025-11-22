"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Header } from '@/components/Header';
import { ChatStream } from '@/components/ChatStream';
import { ChatInput } from '@/components/ChatInput';
import { CalendarStrip } from '@/components/CalendarStrip';

import { useAppData } from '@/context/AppDataContext';
import { useChatFlow } from '@/hooks/useChatFlow';

export default function Home() {
  const { chatHistory } = useAppData();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { currentStep, handleInput, isFlowActive, isViewMode, awaitingConfirmation } = useChatFlow({ selectedDate });

  // Auto-scroll to bottom when chat history changes
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  return (
    <>
      <Header title="SAM" />

      <main className="flex-1 flex flex-col relative overflow-hidden bg-sam-dark">
        {/* Calendar Strip */}
        <CalendarStrip
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        {/* Chat Area */}
        <div className="flex-1 relative min-h-0 pb-24">
          <ChatStream
            messages={chatHistory}
            isViewMode={isViewMode}
            currentStep={isFlowActive ? currentStep : undefined}
            onInput={handleInput}
          />
          <div ref={bottomRef} />
        </div>

        {/* Dynamic Input Area */}
        {isFlowActive && !awaitingConfirmation && currentStep.type === 'text' && (
          <ChatInput
            onSend={handleInput}
            placeholder={currentStep.question}
          />
        )}

        {/* Confirmation Input */}
        {awaitingConfirmation && (
          <ChatInput
            onSend={handleInput}
            placeholder="Type 'yes' to save or 'no' to cancel"
          />
        )}

        {/* View Mode Message */}
        {isViewMode && (
          <div className="fixed bottom-20 w-full text-center text-gray-400 text-sm px-4">
            📖 Viewing log - Select a different date to create a new entry
          </div>
        )}

        {/* Completion Message */}
        {!isFlowActive && !isViewMode && !awaitingConfirmation && (
          <div className="fixed bottom-20 w-full text-center text-gray-400 text-sm px-4">
            ✅ Log complete - Select another date to continue logging
          </div>
        )}
      </main>
    </>
  );
}
