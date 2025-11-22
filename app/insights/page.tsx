import React from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';

export default function InsightsPage() {
    return (
        <>
            <Header title="Insights" />
            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-sam-blue-DEFAULT/20 rounded-full flex items-center justify-center mb-4">
                    <span className="text-4xl">📊</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Insights Coming Soon</h2>
                <p className="text-gray-400">
                    We are analyzing your mood and sleep patterns to provide personalized insights.
                </p>
            </main>
            <BottomNav />
        </>
    );
}
