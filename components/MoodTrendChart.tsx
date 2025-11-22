import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { DailyLog } from '../utils/types';
import { format, parseISO } from 'date-fns';

interface MoodTrendChartProps {
    data: DailyLog[];
}

export const MoodTrendChart: React.FC<MoodTrendChartProps> = ({ data }) => {
    // Prepare data: sort by date ascending and take last 30 days
    const chartData = [...data]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-30)
        .map(log => ({
            date: log.date,
            mood: log.status.moodLevel,
            energy: log.status.energyLevel,
            sleep: log.status.sleepQuality
        }));

    if (chartData.length === 0) {
        return <div className="text-center text-gray-500 py-10">No data available</div>;
    }

    return (
        <div className="w-full h-[300px] bg-sam-card/50 backdrop-blur-md rounded-2xl p-4 border border-white/5">
            <h3 className="text-lg font-semibold text-white mb-4">Mood & Energy Trend</h3>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis
                        dataKey="date"
                        stroke="#666"
                        tickFormatter={(str) => format(parseISO(str), 'MMM d')}
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis stroke="#666" domain={[0, 10]} tick={{ fontSize: 12 }} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                        labelStyle={{ color: '#999', marginBottom: '5px' }}
                        labelFormatter={(label) => format(parseISO(label), 'MMM d, yyyy')}
                    />
                    <Area
                        type="monotone"
                        dataKey="mood"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorMood)"
                        name="Mood"
                    />
                    <Area
                        type="monotone"
                        dataKey="energy"
                        stroke="#10B981"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorEnergy)"
                        name="Energy"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
