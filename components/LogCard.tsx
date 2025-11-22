import React from 'react';
import { DailyLog } from '../utils/types';
import { Activity, Moon, Zap, Trophy, AlertCircle, Lightbulb, Target, Tag } from 'lucide-react';
import clsx from 'clsx';

interface LogCardProps {
    log: DailyLog;
}

export const LogCard: React.FC<LogCardProps> = ({ log }) => {
    const stats = [
        { label: 'Mood', value: log.status.moodLevel, icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Sleep', value: log.status.sleepQuality, icon: Moon, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
        { label: 'Energy', value: log.status.energyLevel, icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    ];

    return (
        <div className="w-full max-w-md mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-white/5">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Daily Log</h3>
                    <span className="text-xs text-gray-400 font-mono">{new Date(log.date).toLocaleDateString()}</span>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-2 p-4">
                {stats.map((stat) => (
                    <div key={stat.label} className={clsx("flex flex-col items-center p-3 rounded-xl border border-white/5", stat.bg)}>
                        <stat.icon size={20} className={clsx("mb-2", stat.color)} />
                        <div className="text-xl font-bold text-white">{stat.value}<span className="text-xs text-gray-500 font-normal">/10</span></div>
                        <div className="text-[10px] uppercase tracking-wider text-gray-400">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className="px-4 pb-4">
                <div className="text-sm text-gray-300 leading-relaxed italic border-l-2 border-sam-blue pl-3">
                    "{log.summary}"
                </div>
            </div>

            {/* Sections */}
            <div className="px-4 pb-4 space-y-4">
                {/* Wins */}
                {log.insights.wins.length > 0 && (
                    <div>
                        <h4 className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            <Trophy size={14} className="mr-2 text-yellow-500" /> Wins
                        </h4>
                        <ul className="space-y-1">
                            {log.insights.wins.map((win, i) => (
                                <li key={i} className="text-sm text-gray-200 flex items-start">
                                    <span className="mr-2 text-green-400">•</span> {win}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Challenges & Ideas Grid */}
                <div className="grid grid-cols-1 gap-4">
                    {log.insights.losses.length > 0 && (
                        <div>
                            <h4 className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                <AlertCircle size={14} className="mr-2 text-red-400" /> Challenges
                            </h4>
                            <ul className="space-y-1">
                                {log.insights.losses.map((loss, i) => (
                                    <li key={i} className="text-sm text-gray-300 flex items-start">
                                        <span className="mr-2 text-red-400">•</span> {loss}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {log.insights.ideas.length > 0 && (
                        <div>
                            <h4 className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                <Lightbulb size={14} className="mr-2 text-amber-400" /> Ideas
                            </h4>
                            <ul className="space-y-1">
                                {log.insights.ideas.map((idea, i) => (
                                    <li key={i} className="text-sm text-gray-300 flex items-start">
                                        <span className="mr-2 text-amber-400">•</span> {idea}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Tags */}
                {log.tags.length > 0 && (
                    <div className="pt-2 border-t border-white/5">
                        <div className="flex flex-wrap gap-2">
                            {log.tags.map((tag, i) => (
                                <span key={i} className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-gray-400 flex items-center">
                                    <Tag size={10} className="mr-1 opacity-50" /> {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
