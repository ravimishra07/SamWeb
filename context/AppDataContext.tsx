"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { ChatMessage } from '../utils/mockData';
import { DailyLog } from '../utils/types';
import { seedData } from '../utils/seedData';
import { db } from '../utils/db';
import { backupService } from '../services/backupService';
import { supabase } from '../utils/supabase/client';

interface AppDataState {
    logs: DailyLog[];
    chatHistory: ChatMessage[];
    addDailyLog: (entry: DailyLog) => Promise<void>;
    updateDailyLog: (entry: DailyLog) => Promise<void>;
    getLogForDate: (date: string) => DailyLog | undefined;
    addChatMessage: (message: ChatMessage) => Promise<void>;
    clearChatHistory: () => Promise<void>;
    clearAllData: () => Promise<void>;
    backupData: (key: string) => Promise<{ success: boolean; error?: string }>;
    restoreData: (key: string) => Promise<{ success: boolean; error?: string; count?: number }>;
}

const AppDataContext = createContext<AppDataState | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Live Queries (Reactive to DB changes)
    const logs = useLiveQuery(() => db.logs.orderBy('date').reverse().toArray()) || [];
    const chatHistory = useLiveQuery(() => db.chatHistory.orderBy('timestamp').toArray()) || [];

    // Seeding Logic
    useEffect(() => {
        const seedDB = async () => {
            const count = await db.logs.count();
            if (count === 0) {
                console.log("Seeding database...");
                await db.logs.bulkAdd(seedData);
            }
        };
        seedDB();
    }, []);

    const addDailyLog = async (entry: DailyLog) => {
        await db.logs.put(entry);

        // Sync to Supabase (Fire and forget)
        try {
            const { error } = await supabase.from('logs').upsert({
                id: entry.id,
                date: entry.date,
                timestamp: entry.timestamp,
                summary: entry.summary,
                status: entry.status,
                insights: entry.insights,
                goals: entry.goals,
                tags: entry.tags,
                trigger_events: entry.triggerEvents,
                symptom_checklist: entry.symptomChecklist
            });
            if (error) console.error("Supabase Sync Error:", error);
        } catch (err) {
            console.error("Supabase Sync Failed:", err);
        }
    };

    const updateDailyLog = async (entry: DailyLog) => {
        await db.logs.put(entry);
    };

    const getLogForDate = (date: string): DailyLog | undefined => {
        return logs.find(log => log.date === date);
    };

    const addChatMessage = async (message: ChatMessage) => {
        // Check for duplicate ID to be safe, though put() overwrites by default
        // We want to avoid overwriting if it's a distinct message with same ID (unlikely with timestamp)
        // But for chat, appending is the goal.
        await db.chatHistory.put(message);
    };

    const clearChatHistory = async () => {
        await db.chatHistory.clear();
    };

    const clearAllData = async () => {
        await db.logs.clear();
        await db.chatHistory.clear();
        window.location.reload();
    };

    const backupData = async (key: string) => {
        return await backupService.backupToCloud(key);
    };

    const restoreData = async (key: string) => {
        return await backupService.restoreFromCloud(key);
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
                backupData,
                restoreData,
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

