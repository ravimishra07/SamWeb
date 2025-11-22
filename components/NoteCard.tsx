"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Edit2 } from 'lucide-react';
import clsx from 'clsx';

interface NoteCardProps {
    date: string;
    notes: string[];
    onAddNote?: (note: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ date, notes }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-sam-card backdrop-blur-sm border border-white/5 rounded-2xl p-4 transition-all duration-300 hover:bg-white/5">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sam-blue-DEFAULT/20 flex items-center justify-center text-sam-blue-glow">
                        <Edit2 size={18} />
                    </div>
                    <div className="text-left">
                        <h3 className="text-sm font-medium text-white">Daily Notes</h3>
                        <p className="text-xs text-gray-500">{notes.length} entries</p>
                    </div>
                </div>
                <div className={clsx("text-gray-400 transition-transform duration-300", isExpanded ? "rotate-180" : "")}>
                    <ChevronDown size={20} />
                </div>
            </button>

            <div
                className={clsx(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isExpanded ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
                )}
            >
                {notes.length > 0 ? (
                    <ul className="space-y-2">
                        {notes.map((note, idx) => (
                            <li key={idx} className="text-sm text-gray-300 pl-4 border-l-2 border-sam-blue-DEFAULT/30 py-1">
                                {note}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500 italic pl-1">No notes for this day.</p>
                )}
            </div>
        </div>
    );
};
