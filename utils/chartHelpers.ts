import { format, parseISO, subDays, startOfMonth, eachDayOfInterval, eachMonthOfInterval, isSameMonth } from 'date-fns';
import { DailyLog } from './types';

export type TimeRange = '7D' | '30D' | '90D' | 'ALL';

export const filterLogsByRange = (logs: DailyLog[], range: TimeRange): DailyLog[] => {
    const now = new Date();
    let startDate: Date;

    switch (range) {
        case '7D':
            startDate = subDays(now, 7);
            break;
        case '30D':
            startDate = subDays(now, 30);
            break;
        case '90D':
            startDate = subDays(now, 90);
            break;
        case 'ALL':
        default:
            return logs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    return logs
        .filter(log => new Date(log.date) >= startDate)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const getXAxisTicks = (data: DailyLog[], range: TimeRange): string[] => {
    if (data.length === 0) return [];

    const dates = data.map(d => d.date);
    const startDate = new Date(dates[0]);
    const endDate = new Date(dates[dates.length - 1]);

    if (range === '7D') {
        // Show every day
        return dates;
    }

    if (range === '30D') {
        // Show every 5 days roughly, or just let Recharts handle it with minTickGap
        // But for "smart" ticks:
        return dates.filter((_, i) => i % 5 === 0);
    }

    if (range === '90D') {
        // Show every 15 days
        return dates.filter((_, i) => i % 15 === 0);
    }

    if (range === 'ALL') {
        // Show start of each month
        const months = eachMonthOfInterval({ start: startDate, end: endDate });
        return months.map(d => format(d, 'yyyy-MM-dd'));
    }

    return dates;
};

export const formatXAxisTick = (dateStr: string, range: TimeRange): string => {
    try {
        const date = parseISO(dateStr);
        if (range === '7D') return format(date, 'EEE'); // Mon, Tue
        if (range === '30D') return format(date, 'MMM d'); // Nov 21
        if (range === '90D') return format(date, 'MMM d'); // Nov 21
        if (range === 'ALL') return format(date, 'MMM yyyy'); // Nov 2024
        return format(date, 'MMM d');
    } catch (e) {
        return dateStr;
    }
};
