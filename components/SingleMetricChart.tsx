import React from 'react';
import { ResponsiveContainer, Area, XAxis, YAxis, CartesianGrid, Tooltip, ComposedChart, Line, ReferenceLine, Scatter } from 'recharts';
import { DailyLog } from '../utils/types';
import { format, parseISO } from 'date-fns';
import { formatXAxisTick, TimeRange } from '../utils/chartHelpers';

interface SingleMetricChartProps {
    data: DailyLog[];
    metricKey: 'mood' | 'energy' | 'sleep' | 'stability' | 'sleepDuration';
    title: string;
    color: string;
    yDomain?: [number, number];
    timeRange?: TimeRange;
    secondaryMetricKey?: 'mood' | 'energy' | 'sleep' | 'stability' | 'sleepDuration'; // Expanded to all metrics
    onDataPointClick?: (logId: string) => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-xl">
                <p className="text-gray-400 text-xs mb-1">{format(parseISO(data.date), 'MMM d, yyyy')}</p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].color }} />
                    <p className="text-white font-medium text-sm">
                        {payload[0].name}: <span className="font-bold">{payload[0].value}</span>
                    </p>
                </div>
                {payload[1] && (
                    <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[1].color }} />
                        <p className="text-white font-medium text-sm">
                            {payload[1].name}: <span className="font-bold">{payload[1].value}</span>
                        </p>
                    </div>
                )}
                {data.tags && data.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                        {data.tags.slice(0, 3).map((tag: string, i: number) => (
                            <span key={i} className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-300">#{tag}</span>
                        ))}
                    </div>
                )}
            </div>
        );
    }
    return null;
};

export const SingleMetricChart: React.FC<SingleMetricChartProps> = ({
    data,
    metricKey,
    title,
    color,
    yDomain = [0, 10],
    timeRange = '30D',
    secondaryMetricKey,
    onDataPointClick
}) => {
    // Prepare data
    const chartData = data.map(log => ({
        ...log,
        value: metricKey === 'mood' ? log.status.moodLevel :
            metricKey === 'energy' ? log.status.energyLevel :
                metricKey === 'sleep' ? log.status.sleepQuality :
                    metricKey === 'sleepDuration' ? log.status.sleepDuration :
                        log.status.stabilityScore,
        secondaryValue: secondaryMetricKey ? (
            secondaryMetricKey === 'mood' ? log.status.moodLevel :
                secondaryMetricKey === 'energy' ? log.status.energyLevel :
                    secondaryMetricKey === 'sleep' ? log.status.sleepQuality :
                        secondaryMetricKey === 'sleepDuration' ? log.status.sleepDuration :
                            log.status.stabilityScore
        ) : undefined,
        // Add a marker for high anxiety/insomnia
        hasIssue: log.tags.includes('anxiety') || log.tags.includes('insomnia') ? log.status.moodLevel : undefined
    }));

    if (chartData.length === 0) {
        return <div className="text-center text-gray-500 py-10">No data available for {title}</div>;
    }

    return (
        <div className="w-full h-[250px] bg-sam-card/50 backdrop-blur-md rounded-2xl p-4 border border-white/5 mb-4 relative group">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">{title}</h3>
                {secondaryMetricKey && <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded-full">vs {secondaryMetricKey}</span>}
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} onClick={(e: any) => e && e.activePayload && onDataPointClick && onDataPointClick(e.activePayload[0].payload.id)}>
                    <defs>
                        <linearGradient id={`color-${metricKey}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis
                        dataKey="date"
                        stroke="#666"
                        tickFormatter={(str) => formatXAxisTick(str, timeRange)}
                        tick={{ fontSize: 10 }}
                        interval="preserveStartEnd"
                        minTickGap={30}
                    />
                    <YAxis stroke="#666" domain={yDomain} tick={{ fontSize: 10 }} width={20} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1, strokeDasharray: '5 5' }} />

                    {/* Reference Lines for Context */}
                    <ReferenceLine y={5} stroke="#444" strokeDasharray="3 3" />

                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={2}
                        fillOpacity={1}
                        fill={`url(#color-${metricKey})`}
                        name={title}
                        activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
                    />

                    {/* God Mode Overlay */}
                    {secondaryMetricKey && (
                        <Line
                            type="monotone"
                            dataKey="secondaryValue"
                            stroke="#8B5CF6"
                            strokeWidth={2}
                            dot={false}
                            strokeOpacity={0.5}
                            name={
                                secondaryMetricKey === 'mood' ? 'Mood' :
                                    secondaryMetricKey === 'energy' ? 'Energy' :
                                        secondaryMetricKey === 'sleep' ? 'Sleep Quality' :
                                            secondaryMetricKey === 'sleepDuration' ? 'Sleep Duration' :
                                                'Stability'
                            }
                        />
                    )}

                    {/* Context Dots (Anxiety/Insomnia) */}
                    <Scatter dataKey="hasIssue" fill="#EF4444" shape="circle" />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};
