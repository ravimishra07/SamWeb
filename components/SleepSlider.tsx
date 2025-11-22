"use client";

import React from 'react';
import { MoodSlider } from './MoodSlider';
import clsx from 'clsx';

interface SleepSliderProps {
    hours: number;
    quality: 'Great' | 'Okay' | 'Meh';
    onHoursChange: (value: number) => void;
    onQualityChange: (quality: 'Great' | 'Okay' | 'Meh') => void;
}

export const SleepSlider: React.FC<SleepSliderProps> = ({ hours, quality, onHoursChange, onQualityChange }) => {
    const qualities: ('Great' | 'Okay' | 'Meh')[] = ['Great', 'Okay', 'Meh'];

    return (
        <div className="flex flex-col gap-2">
            <MoodSlider value={hours} onChange={onHoursChange} label="Sleep" />

            <div className="flex gap-2 px-1">
                {qualities.map((q) => (
                    <button
                        key={q}
                        onClick={() => onQualityChange(q)}
                        className={clsx(
                            "px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border",
                            quality === q
                                ? "bg-sam-blue-DEFAULT border-sam-blue-glow text-white shadow-md"
                                : "bg-sam-card border-white/5 text-gray-400 hover:bg-white/10"
                        )}
                    >
                        {q}
                    </button>
                ))}
            </div>
        </div>
    );
};
