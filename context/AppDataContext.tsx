
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ChatMessage, MOCK_CHAT } from '../utils/mockData';
import { saveToStorage, getFromStorage, STORAGE_KEYS } from '../utils/storage';
import { DailyLog } from '../utils/types';

interface AppDataState {
    logs: DailyLog[];
    chatHistory: ChatMessage[];
    addDailyLog: (entry: DailyLog) => void;
    updateDailyLog: (entry: DailyLog) => void;
    getLogForDate: (date: string) => DailyLog | undefined;
    addChatMessage: (message: ChatMessage) => void;
    clearChatHistory: () => void;
    clearAllData: () => void;
}

const AppDataContext = createContext<AppDataState | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [logs, setLogs] = useState<DailyLog[]>([]);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Load initial data
        const storedLogs = getFromStorage<DailyLog[]>(STORAGE_KEYS.LOGS, []);
        const storedChat = getFromStorage<ChatMessage[]>(STORAGE_KEYS.CHAT, []);
        setLogs(storedLogs);
        setChatHistory(storedChat);
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            saveToStorage(STORAGE_KEYS.LOGS, logs);
        }
    }, [logs, isLoaded]);

    useEffect(() => {
        if (isLoaded) {
            saveToStorage(STORAGE_KEYS.CHAT, chatHistory);
        }
    }, [chatHistory, isLoaded]);

    const addDailyLog = (entry: DailyLog) => {
        setLogs((prev) => {
            // Check if log already exists for this date
            const existingIndex = prev.findIndex(log => log.date === entry.date);
            if (existingIndex !== -1) {
                // Update existing log
                const updated = [...prev];
                updated[existingIndex] = entry;
                return updated;
            }
            // Add new log
            return [...prev, entry];
        });
    };

    const updateDailyLog = (entry: DailyLog) => {
        setLogs((prev) => {
            const index = prev.findIndex(log => log.date === entry.date);
            if (index !== -1) {
                const updated = [...prev];
                updated[index] = entry;
                return updated;
            }
            return prev;
        });
    };

    const getLogForDate = (date: string): DailyLog | undefined => {
        return logs.find(log => log.date === date);
    };

    const addChatMessage = (message: ChatMessage) => {
        setChatHistory((prev) => [...prev, message]);
    };

    const clearChatHistory = () => {
        setChatHistory([]);
    };

    const clearAllData = () => {
        setLogs([]);
        setChatHistory([]);
        localStorage.clear();
        window.location.reload();
    };

    return (
        <AppDataContext.Provider
            value={{
                logs,
                chatHistory,
                addDailyLog,
                updateDailyLog,
                getLogForDate,
                addChatMessage,
                clearChatHistory,
                clearAllData,
            }}
        >
            {children}
        </AppDataContext.Provider>
    );
};

export const useAppData = () => {
    const context = useContext(AppDataContext);
    if (context === undefined) {
        throw new Error('useAppData must be used within an AppDataProvider');
    }
    return context;
};

