"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Header } from '@/components/Header';
import { ChatStream } from '@/components/ChatStream';
import { ChatInput } from '@/components/ChatInput';
import { CalendarStrip } from '@/components/CalendarStrip';

import { useAppData } from '@/context/AppDataContext';
import { useSmartSearch } from '@/hooks/useSmartSearch';
import { useChatFlow } from '@/hooks/useChatFlow';

import { SimpleEntryForm } from '@/components/SimpleEntryForm';

export default function Home() {
  const { chatHistory, addChatMessage } = useAppData();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [entryMode, setEntryMode] = useState<'chat' | 'simple'>('chat');

  const { currentStep, handleInput, isFlowActive, isViewMode, awaitingConfirmation } = useChatFlow({ selectedDate, isSearchMode });
  const { handleSearch, isSearching } = useSmartSearch();

  // Auto-scroll to bottom when chat history changes
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isSearching]);

  const handleSend = (text: string) => {
    if (isSearchMode) {
      // Add user message first
      addChatMessage({
        id: Date.now().toString(),
        role: 'user',
        content: text,
        timestamp: Date.now()
      });
      handleSearch(text);
    } else {
      handleInput(text);
    }
  };

  return (
    <>
      <Header title="SAM" />

      <main className="flex-1 flex flex-col relative overflow-hidden bg-sam-dark">
        {/* Mode Toggle */}
        {!isSearchMode && (
          <div className="px-4 py-2 flex justify-center">
            <div className="bg-white/5 p-1 rounded-xl flex gap-1">
              <button
                onClick={() => setEntryMode('chat')}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${entryMode === 'chat' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Chat
              </button>
              <button
                onClick={() => setEntryMode('simple')}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${entryMode === 'simple' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Entry
              </button>
            </div>
          </div>
        )}

        {/* Calendar Strip (Hidden in Search Mode) */}
        {!isSearchMode && (
          <CalendarStrip
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        )}

        {entryMode === 'simple' && !isSearchMode ? (
          <div className="flex-1 overflow-y-auto px-4 pt-4">
            <SimpleEntryForm />
          </div>
        ) : (
          <>
            {/* Chat Area */}
            <div className="flex-1 relative min-h-0 pb-24">
              <ChatStream
                messages={chatHistory}
                isViewMode={isViewMode || isSearchMode}
                currentStep={isFlowActive ? currentStep : undefined}
                onInput={handleInput}
              />
              {isSearching && (
                <div className="flex justify-start w-full px-4 py-2">
                  <div className="bg-white/5 text-gray-400 text-xs px-3 py-1 rounded-full animate-pulse">
                    Searching history...
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Dynamic Input Area */}
            {(!awaitingConfirmation) && (
              (isSearchMode) ||
              (!isFlowActive) ||
              (isFlowActive) // Always show input if flow is active, even for slider steps
            ) && (
                <ChatInput
                  onSend={handleSend}
                  placeholder={
                    isSearchMode
                      ? "Ask about your history..."
                      : isFlowActive
                        ? currentStep.question
                        : "Select a date to log, or switch to Search"
                  }
                  isSearchMode={isSearchMode}
                  onToggleMode={() => setIsSearchMode(!isSearchMode)}
                />
              )}

            {/* Confirmation Input */}
            {!isSearchMode && awaitingConfirmation && (
              <ChatInput
                onSend={handleInput}
                placeholder="Type 'yes' to save or 'no' to cancel"
              />
            )}

            {/* View Mode Message */}
            {!isSearchMode && isViewMode && (
              <div className="fixed bottom-20 w-full text-center text-gray-400 text-sm px-4">
                📖 Viewing log - Select a different date to create a new entry
              </div>
            )}

            {/* Completion Message */}
            {!isSearchMode && !isFlowActive && !isViewMode && !awaitingConfirmation && (
              <div className="fixed bottom-20 w-full text-center text-gray-400 text-sm px-4">
                ✅ Log complete - Select another date to continue logging
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
