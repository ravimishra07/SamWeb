"use client";

import React from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { useAppData } from '@/context/AppDataContext';

export default function ProfilePage() {
    const { logs, chatHistory, clearAllData } = useAppData();

    const handleExport = () => {
        const data = {
            logs,
            chatHistory,
            exportDate: new Date().toISOString(),
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sam-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <Header title="Profile" />
            <main className="flex-1 flex flex-col p-6 space-y-6">
                <div className="bg-sam-card p-6 rounded-2xl border border-white/5">
                    <h2 className="text-lg font-bold text-white mb-4">Data Management</h2>
                    <div className="space-y-3">
                        <button
                            onClick={handleExport}
                            className="w-full py-3 bg-sam-blue-DEFAULT hover:bg-sam-blue-dark text-white rounded-xl font-medium transition-colors"
                        >
                            Export Data (JSON)
                        </button>
                        <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors border border-white/10">
                            Import Data
                        </button>
                        <button
                            onClick={() => {
                                if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                                    clearAllData();
                                }
                            }}
                            className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl font-medium transition-colors border border-red-500/20"
                        >
                            Clear All Data
                        </button>
                    </div>
                </div>
            </main>
            <BottomNav />
        </>
    );
}
