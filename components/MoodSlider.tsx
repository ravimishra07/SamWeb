"use client";

import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

interface MoodSliderProps {
    value: number;
    onChange: (value: number) => void;
    label?: string;
    min?: number;
    max?: number;
}

export const MoodSlider: React.FC<MoodSliderProps> = ({ value, onChange, label = "Mood", min = 1, max = 10 }) => {
    const [isDragging, setIsDragging] = useState(false);
    const trackRef = useRef<HTMLDivElement>(null);

    const handleInteraction = (clientX: number) => {
        if (!trackRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = Math.min(Math.max(x / rect.width, 0), 1);
        const range = max - min;
        const newValue = Math.round(percentage * range) + min;
        onChange(newValue);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        handleInteraction(e.clientX);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        handleInteraction(e.touches[0].clientX);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                handleInteraction(e.clientX);
            }
        };
        const handleTouchMove = (e: TouchEvent) => {
            if (isDragging) {
                handleInteraction(e.touches[0].clientX);
            }
        };
        const handleUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('mouseup', handleUp);
            window.addEventListener('touchend', handleUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('mouseup', handleUp);
            window.removeEventListener('touchend', handleUp);
        };
    }, [isDragging]);

    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className="w-full py-4 px-1">
            <div className="flex justify-between mb-2 px-1">
                <span className="text-gray-400 text-sm font-medium">{label}</span>
                <span className="text-sam-blue-glow font-bold text-sm">{value}/{max}</span>
            </div>

            <div
                className="relative h-12 flex items-center cursor-pointer touch-none"
                ref={trackRef}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            >
                {/* Track Background */}
                <div className="absolute w-full h-4 bg-gray-800 rounded-full overflow-hidden shadow-inner">
                    {/* Active Track */}
                    <div
                        className="h-full bg-sam-blue-DEFAULT transition-all duration-75 ease-out"
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                {/* Thumb */}
                <div
                    className={clsx(
                        "absolute h-8 w-8 bg-white rounded-full shadow-lg flex items-center justify-center transition-transform duration-100 ease-out z-10",
                        isDragging ? "scale-110" : "scale-100"
                    )}
                    style={{ left: `calc(${percentage}% - 16px)` }}
                >
                    <div className="w-2 h-2 bg-sam-blue-DEFAULT rounded-full" />

                    {/* Floating Bubble */}
                    {isDragging && (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-sam-blue-DEFAULT text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg animate-in fade-in zoom-in duration-200">
                            {value}
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-sam-blue-DEFAULT rotate-45" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
