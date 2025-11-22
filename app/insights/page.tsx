"use client";

import React from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { useAppData } from '@/context/AppDataContext';
import { MoodTrendChart } from '@/components/MoodTrendChart';
import { StatsCards } from '@/components/StatsCards';

export default function InsightsPage() {
    const { logs } = useAppData();

    return (
        <>
            <Header title="Insights" />

            <main className="flex-1 overflow-y-auto bg-sam-dark pb-24">
                <div className="p-4 space-y-6 max-w-md mx-auto">

                    {/* Stats Overview */}
                    <section>
                        <h2 className="text-white font-semibold mb-3 px-1">Overview</h2>
                        <StatsCards data={logs} />
                    </section>

                    {/* Mood Trend Chart */}
                    <section>
                        <h2 className="text-white font-semibold mb-3 px-1">Trends</h2>
                        <MoodTrendChart data={logs} />
                    </section>

                    {/* Recent Wins (extracted from logs) */}
                    <section>
                        <h2 className="text-white font-semibold mb-3 px-1">Recent Wins</h2>
                        <div className="space-y-3">
                            {logs.slice(0, 5).map(log => (
                                log.insights.wins.length > 0 && (
                                    <div key={log.id} className="bg-sam-card/30 border border-white/5 rounded-xl p-4">
                                        <div className="text-xs text-gray-500 mb-1">{log.date}</div>
                                        <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                                            {log.insights.wins.slice(0, 2).map((win, i) => (
                                                <li key={i}>{win}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )
                            ))}
                        </div>
                    </section>

                </div>
            </main>

            <BottomNav />
        </>
    );
}
