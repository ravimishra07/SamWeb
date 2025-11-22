"use client";

import React, { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { useAppData } from '@/context/AppDataContext';
import { SingleMetricChart } from '@/components/SingleMetricChart';
import { TimeRange, filterLogsByRange } from '@/utils/chartHelpers';
import clsx from 'clsx';


export default function InsightsPage() {
    const { logs } = useAppData();
    const [timeRange, setTimeRange] = useState<TimeRange>('30D');
    const [comparisonMetric, setComparisonMetric] = useState<'mood' | 'energy' | 'sleep' | 'stability' | 'sleepDuration' | null>(null);

    const filteredLogs = useMemo(() => filterLogsByRange(logs, timeRange), [logs, timeRange]);

    const ranges: TimeRange[] = ['7D', '30D', '90D', 'ALL'];
    const metrics = [
        { key: 'mood', label: 'Mood' },
        { key: 'sleep', label: 'Sleep Q.' },
        { key: 'energy', label: 'Energy' },
        { key: 'stability', label: 'Stability' },
        { key: 'sleepDuration', label: 'Duration' },
    ];

    return (
        <>
            <Header title="Insights" />

            <main className="flex-1 overflow-y-auto bg-sam-dark pb-24">
                <div className="p-4 space-y-6 max-w-md mx-auto">

                    {/* Controls */}
                    <div className="flex flex-col gap-4">
                        {/* Time Range Chips */}
                        <div className="flex justify-between bg-white/5 p-1 rounded-xl">
                            {ranges.map(range => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={clsx(
                                        "px-4 py-1.5 rounded-lg text-xs font-medium transition-all flex-1",
                                        timeRange === range ? "bg-sam-blue text-white shadow-lg" : "text-gray-400 hover:text-white"
                                    )}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>

                        {/* Correlation Engine (Compare With...) */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between px-2">
                                <span className="text-sm text-gray-300 font-medium">Compare with...</span>
                                {comparisonMetric && (
                                    <button
                                        onClick={() => setComparisonMetric(null)}
                                        className="text-xs text-red-400 hover:text-red-300"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                {metrics.map(m => (
                                    <button
                                        key={m.key}
                                        onClick={() => setComparisonMetric(comparisonMetric === m.key ? null : m.key as any)}
                                        className={clsx(
                                            "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border",
                                            comparisonMetric === m.key
                                                ? "bg-sam-blue/20 border-sam-blue text-sam-blue"
                                                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                                        )}
                                    >
                                        {m.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Vertical Stacked Graphs */}
                    <div className="space-y-6">
                        <SingleMetricChart
                            data={filteredLogs}
                            metricKey="mood"
                            title="Mood Level"
                            color="#3B82F6" // Blue
                            timeRange={timeRange}
                            secondaryMetricKey={comparisonMetric && comparisonMetric !== 'mood' ? comparisonMetric : undefined}
                        />
                        <SingleMetricChart
                            data={filteredLogs}
                            metricKey="sleep"
                            title="Sleep Quality"
                            color="#8B5CF6" // Purple
                            timeRange={timeRange}
                            secondaryMetricKey={comparisonMetric && comparisonMetric !== 'sleep' ? comparisonMetric : undefined}
                        />
                        <SingleMetricChart
                            data={filteredLogs}
                            metricKey="sleepDuration"
                            title="Sleep Duration (Hours)"
                            color="#6366F1" // Indigo
                            yDomain={[0, 12]}
                            timeRange={timeRange}
                            secondaryMetricKey={comparisonMetric && comparisonMetric !== 'sleepDuration' ? comparisonMetric : undefined}
                        />
                        <SingleMetricChart
                            data={filteredLogs}
                            metricKey="energy"
                            title="Energy Level"
                            color="#10B981" // Emerald
                            timeRange={timeRange}
                            secondaryMetricKey={comparisonMetric && comparisonMetric !== 'energy' ? comparisonMetric : undefined}
                        />
                        <SingleMetricChart
                            data={filteredLogs}
                            metricKey="stability"
                            title="Emotional Stability"
                            color="#F59E0B" // Amber
                            timeRange={timeRange}
                            secondaryMetricKey={comparisonMetric && comparisonMetric !== 'stability' ? comparisonMetric : undefined}
                        />
                    </div>



                </div>
            </main>
        </>
    );
}
