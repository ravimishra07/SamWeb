import { format, isToday, isSameDay, subDays, addDays, startOfWeek } from 'date-fns';

export const formatDate = (date: Date | number, formatStr: string = 'MMM d'): string => {
    return format(date, formatStr);
};

export const isDateToday = (date: Date | number): boolean => {
    return isToday(date);
};

export const getWeekDays = (startDate: Date = new Date()): Date[] => {
    const start = startOfWeek(startDate, { weekStartsOn: 1 }); // Start on Monday
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
};

export const getLast7Days = (): Date[] => {
    const today = new Date();
    return Array.from({ length: 7 }).map((_, i) => subDays(today, 6 - i));
};

export const isSameDate = (date1: Date | number, date2: Date | number): boolean => {
    return isSameDay(date1, date2);
};

/**
 * Converts a Date object to YYYY-MM-DD string format for storage
 */
export const formatDateKey = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
};

/**
 * Parses a YYYY-MM-DD string back to a Date object
 */
export const parseDateKey = (key: string): Date => {
    return new Date(key);
};
