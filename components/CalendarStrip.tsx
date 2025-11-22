"use client";

import React, { useRef, useEffect } from 'react';
import { format, isSameDay } from 'date-fns';
import clsx from 'clsx';
import { getWeekDays, isDateToday } from '../utils/dateUtils';

interface CalendarStripProps {
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
}

export const CalendarStrip: React.FC<CalendarStripProps> = ({ selectedDate, onSelectDate }) => {
    const dates = getWeekDays(selectedDate); // Or just a static window around today
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll selected date into view on mount
        if (scrollRef.current) {
            // Simple logic to center: find the selected element index
            // For now, just ensuring it's visible
        }
    }, []);

    return (
        <div className="w-full overflow-x-auto no-scrollbar py-4 px-4" ref={scrollRef}>
            <div className="flex gap-3 min-w-max">
                {dates.map((date) => {
                    const isSelected = isSameDay(date, selectedDate);
                    const isTodayDate = isDateToday(date);

                    return (
                        <button
                            key={date.toISOString()}
                            onClick={() => onSelectDate(date)}
                            className={clsx(
                                "flex flex-col items-center justify-center w-14 h-16 rounded-2xl transition-all duration-300 border",
                                isSelected
                                    ? "bg-sam-blue-DEFAULT border-sam-blue-glow shadow-lg shadow-sam-blue-DEFAULT/20 scale-105"
                                    : "bg-sam-card border-white/5 hover:bg-white/10"
                            )}
                        >
                            <span className={clsx("text-xs font-medium mb-1", isSelected ? "text-white/90" : "text-gray-500")}>
                                {format(date, 'EEE')}
                            </span>
                            <span className={clsx("text-lg font-bold", isSelected ? "text-white" : "text-gray-300")}>
                                {format(date, 'd')}
                            </span>
                            {isTodayDate && !isSelected && (
                                <div className="w-1 h-1 rounded-full bg-sam-blue-DEFAULT mt-1" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
