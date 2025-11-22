"use client";

import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

interface MoodSliderProps {
    value: number;
    onChange: (value: number) => void;
    onSubmit?: (value: number) => void;
    label?: string;
    min?: number;
    max?: number;
}

export const MoodSlider: React.FC<MoodSliderProps> = ({ value, onChange, onSubmit, label = "Mood", min = 1, max = 10 }) => {
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
        <div className="w-full max-w-[300px] mx-auto bg-[#1a1a1a] rounded-xl p-4 border border-white/5 shadow-xl">
            <div className="flex justify-between items-center mb-4">
                <span className="text-gray-300 font-medium text-sm">{label}</span>
                <span className="text-white font-bold text-base">{value}</span>
            </div>

            <div className="relative h-10 flex items-center justify-center mb-4">
                {/* Track Container */}
                <div
                    className="relative w-full h-2 bg-[#2A2A2A] rounded-full overflow-hidden cursor-pointer touch-none"
                    ref={trackRef}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                >
                    {/* Gradient Track */}
                    <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full transition-all duration-75 ease-out"
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                {/* Ring Thumb */}
                <div
                    className={clsx(
                        "absolute h-5 w-5 bg-[#1a1a1a] border-[2px] border-white rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] flex items-center justify-center pointer-events-none transition-transform duration-100 ease-out z-10",
                        isDragging ? "scale-110" : "scale-100"
                    )}
                    style={{ left: `calc(${percentage}% - 10px)` }}
                />
            </div>

            <div className="flex justify-between text-[10px] text-gray-500 font-medium mb-4 uppercase tracking-wider">
                <span>Low</span>
                <span>High</span>
            </div>

            {onSubmit && (
                <button
                    onClick={() => onSubmit(value)}
                    className="w-full py-2 bg-[#1E3A8A] hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors shadow-lg active:scale-[0.98] transform duration-100"
                >
                    Done
                </button>
            )}
        </div>
    );
};
