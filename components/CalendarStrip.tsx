"use client";

import React, { useRef, useEffect, useState } from 'react';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { getWeekDays, isDateToday } from '../utils/dateUtils';

interface CalendarStripProps {
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
}

export const CalendarStrip: React.FC<CalendarStripProps> = ({ selectedDate, onSelectDate }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const scrollRef = useRef<HTMLDivElement>(null);

    // Sync current month with selected date when it changes
    useEffect(() => {
        setCurrentMonth(selectedDate);
    }, [selectedDate]);

    // Generate dates based on view mode
    const dates = isExpanded
        ? eachDayOfInterval({
            start: startOfWeek(startOfMonth(currentMonth)),
            end: endOfWeek(endOfMonth(currentMonth))
        })
        : getWeekDays(selectedDate);

    const handlePrevMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const handleNextMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    return (
        <div className={clsx(
            "w-full px-4 py-4 transition-all duration-300 ease-in-out bg-sam-dark/50 backdrop-blur-sm border-b border-white/5",
            isExpanded ? "h-auto pb-6" : "h-auto"
        )}>
            {/* Header / Toggle */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-white font-semibold text-lg">
                        {isExpanded ? format(currentMonth, 'MMMM yyyy') : format(selectedDate, 'MMMM yyyy')}
                    </h3>
                    {isExpanded && (
                        <div className="flex gap-1 ml-2">
                            <button onClick={handlePrevMonth} className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white">
                                <ChevronLeft size={16} />
                            </button>
                            <button onClick={handleNextMonth} className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-1 text-xs text-sam-blue hover:text-blue-400 transition-colors"
                >
                    {isExpanded ? 'Collapse' : 'Expand'}
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
            </div>

            {/* Calendar Grid/Strip */}
            <div
                className={clsx(
                    "w-full transition-all",
                    isExpanded ? "grid grid-cols-7 gap-2" : "flex gap-3 overflow-x-auto no-scrollbar"
                )}
                ref={scrollRef}
            >
                {/* Weekday Headers for Expanded View */}
                {isExpanded && ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-[10px] text-gray-500 uppercase tracking-wider mb-2">
                        {day}
                    </div>
                ))}

                {dates.map((date) => {
                    const isSelected = isSameDay(date, selectedDate);
                    const isTodayDate = isDateToday(date);
                    const isCurrentMonth = date.getMonth() === currentMonth.getMonth();

                    return (
                        <button
                            key={date.toISOString()}
                            onClick={() => {
                                onSelectDate(date);
                                // Don't collapse automatically, let user explore
                            }}
                            className={clsx(
                                "flex flex-col items-center justify-center rounded-2xl transition-all duration-200 relative overflow-hidden group",
                                isExpanded ? "h-12 w-full aspect-square" : "w-14 h-16 flex-shrink-0",
                                isSelected
                                    ? "border border-sam-blue-glow shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                                    : "bg-white/5 border border-white/5 hover:bg-white/10",
                                !isCurrentMonth && isExpanded && "opacity-30"
                            )}
                        >
                            {isSelected && (
                                <div className="absolute inset-0 bg-gradient-to-br from-sam-blue-DEFAULT to-blue-600 opacity-100" />
                            )}

                            {!isExpanded && (
                                <span className={clsx("text-xs font-medium mb-1 relative z-10", isSelected ? "text-white/90" : "text-gray-500 group-hover:text-gray-400")}>
                                    {format(date, 'EEE')}
                                </span>
                            )}

                            <span className={clsx(
                                "font-bold relative z-10",
                                isExpanded ? "text-sm" : "text-lg",
                                isSelected ? "text-white" : "text-gray-300 group-hover:text-white"
                            )}>
                                {format(date, 'd')}
                            </span>

                            {isTodayDate && !isSelected && (
                                <div className="w-1 h-1 rounded-full bg-sam-blue-DEFAULT mt-1 relative z-10" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
