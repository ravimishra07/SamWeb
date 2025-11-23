"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smile, Frown, Meh, Moon, Zap, Activity, Tag, Plus, Save, Mic } from 'lucide-react';
import clsx from 'clsx';
import { useAppData } from '@/context/AppDataContext';

export const SimpleEntryForm: React.FC = () => {
    const { addDailyLog } = useAppData();
    const [mood, setMood] = useState(5);
    const [energy, setEnergy] = useState(5);
    const [anxiety, setAnxiety] = useState(3);
    const [sleepHours, setSleepHours] = useState(7);
    const [sleepMinutes, setSleepMinutes] = useState(30);
    const [sleepQuality, setSleepQuality] = useState(5);
    const [stability, setStability] = useState(5);
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState('');
    const [goals, setGoals] = useState('');
    const [wins, setWins] = useState('');
    const [challenges, setChallenges] = useState('');
    const [thoughts, setThoughts] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleAddTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            setTags([...tags, newTag.trim()]);
            setNewTag('');
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { v4: uuidv4 } = await import('uuid');
            const now = new Date();
            const dateStr = now.toISOString().split('T')[0];

            const logData = {
                id: uuidv4(),
                date: dateStr,
                timestamp: now.toISOString(),
                summary: thoughts || "Daily Check-in",
                status: {
                    moodLevel: mood,
                    energyLevel: energy,
                    anxietyLevel: anxiety,
                    sleepDuration: sleepHours + (sleepMinutes / 60),
                    sleepQuality: sleepQuality,
                    stabilityScore: stability
                },
                tags,
                goals: goals.split('\n').filter(g => g.trim()),
                insights: {
                    wins: wins.split('\n').filter(w => w.trim()),
                    losses: challenges.split('\n').filter(c => c.trim()),
                    ideas: []
                },
                triggerEvents: [],
                symptomChecklist: []
            };

            await addDailyLog(logData);
            alert("Log saved successfully!");
            // Reset form (optional)
        } catch (e) {
            console.error(e);
            alert("Failed to save log.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 pb-24">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white">Daily Log</h2>
                <p className="text-gray-400 text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>

            {/* Mood Slider */}
            <SliderSection title="Mood" value={mood} onChange={setMood} minLabel="Bad" maxLabel="Great" color="text-yellow-400" />

            {/* Anxiety Slider */}
            <SliderSection title="Anxiety" value={anxiety} onChange={setAnxiety} minLabel="Low" maxLabel="High" color="text-red-400" />

            {/* Stability Slider */}
            <SliderSection title="Stability" value={stability} onChange={setStability} minLabel="Unstable" maxLabel="Stable" color="text-blue-400" />

            {/* Sleep Section */}
            <Section title="Sleep">
                <div className="space-y-6">
                    {/* Duration */}
                    <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Moon className="text-sam-purple w-4 h-4" />
                            <span>Duration</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={sleepHours}
                                onChange={(e) => setSleepHours(parseInt(e.target.value))}
                                className="w-12 bg-transparent text-center text-white border-b border-white/20 focus:border-sam-purple outline-none"
                            />
                            <span className="text-sm text-gray-400">h</span>
                            <input
                                type="number"
                                value={sleepMinutes}
                                onChange={(e) => setSleepMinutes(parseInt(e.target.value))}
                                className="w-12 bg-transparent text-center text-white border-b border-white/20 focus:border-sam-purple outline-none"
                            />
                            <span className="text-sm text-gray-400">m</span>
                        </div>
                    </div>

                    {/* Quality Slider */}
                    <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-2">
                            <span>Poor Quality</span>
                            <span>Restful</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={sleepQuality}
                            onChange={(e) => setSleepQuality(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-sam-purple"
                        />
                        <div className="text-center mt-2 font-bold text-sam-purple">{sleepQuality}/10</div>
                    </div>
                </div>
            </Section>

            {/* Energy Slider (Optional based on request, but keeping for completeness) */}
            <SliderSection title="Energy" value={energy} onChange={setEnergy} minLabel="Low" maxLabel="High" color="text-green-400" />

            {/* Tags */}
            <Section title="Tags">
                <div className="flex flex-wrap gap-2 mb-3">
                    {tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-xs text-white flex items-center gap-2">
                            #{tag}
                            <button onClick={() => setTags(tags.filter(t => t !== tag))} className="hover:text-red-400">×</button>
                        </span>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                        placeholder="Add a tag..."
                        className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-sam-gold outline-none"
                    />
                    <button onClick={handleAddTag} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 text-white">
                        <Plus size={20} />
                    </button>
                </div>
            </Section>

            {/* Text Areas */}
            <TextAreaSection label="Today's Goals" value={goals} onChange={setGoals} placeholder="What do you want to accomplish?" />
            <TextAreaSection label="Wins" value={wins} onChange={setWins} placeholder="What went well today?" />
            <TextAreaSection label="Challenges" value={challenges} onChange={setChallenges} placeholder="What was difficult?" />
            <TextAreaSection label="Thoughts" value={thoughts} onChange={setThoughts} placeholder="Any other thoughts..." />

            {/* Save Button */}
            <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full py-4 bg-sam-blue hover:bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
            >
                {isSaving ? <Activity className="animate-spin" /> : <Save size={20} />}
                Save Log
            </button>
        </div>
    );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-sam-card/40 backdrop-blur-md border border-white/5 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            {title}
        </h3>
        {children}
    </div>
);

const SliderSection: React.FC<{ title: string; value: number; onChange: (v: number) => void; minLabel: string; maxLabel: string; color: string }> = ({ title, value, onChange, minLabel, maxLabel, color }) => (
    <Section title={title}>
        <div className="px-2">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>{minLabel}</span>
                <span>{maxLabel}</span>
            </div>
            <input
                type="range"
                min="1"
                max="10"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className={clsx("w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer", `accent-${color.split('-')[1]}-500`)}
                style={{ accentColor: 'currentColor' }} // Fallback or use Tailwind class if configured
            />
            <div className={clsx("text-center mt-2 font-bold", color)}>{value}/10</div>
        </div>
    </Section>
);

const TextAreaSection: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder: string }> = ({ label, value, onChange, placeholder }) => (
    <div className="bg-sam-card/40 backdrop-blur-md border border-white/5 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-white mb-2">{label}</h3>
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-24 bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-600 focus:border-sam-blue outline-none resize-none"
        />
    </div>
);
