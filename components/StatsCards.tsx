import React from 'react';
import { DailyLog } from '../utils/types';
import { Activity, Moon, Zap, Calendar } from 'lucide-react';

interface StatsCardsProps {
    data: DailyLog[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ data }) => {
    const totalLogs = data.length;

    const avgMood = totalLogs > 0
        ? (data.reduce((acc, log) => acc + log.status.moodLevel, 0) / totalLogs).toFixed(1)
        : '-';

    const avgSleep = totalLogs > 0
        ? (data.reduce((acc, log) => acc + log.status.sleepQuality, 0) / totalLogs).toFixed(1)
        : '-';

    const avgEnergy = totalLogs > 0
        ? (data.reduce((acc, log) => acc + log.status.energyLevel, 0) / totalLogs).toFixed(1)
        : '-';

    const stats = [
        { label: 'Total Logs', value: totalLogs, icon: Calendar, color: 'text-blue-400' },
        { label: 'Avg Mood', value: avgMood, icon: Activity, color: 'text-purple-400' },
        { label: 'Avg Sleep', value: avgSleep, icon: Moon, color: 'text-indigo-400' },
        { label: 'Avg Energy', value: avgEnergy, icon: Zap, color: 'text-emerald-400' },
    ];

    return (
        <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
                <div key={index} className="bg-sam-card/50 backdrop-blur-md border border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                    <div className={`p-2 rounded-full bg-white/5 mb-2 ${stat.color}`}>
                        <stat.icon size={20} />
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">{stat.label}</div>
                </div>
            ))}
        </div>
    );
};
