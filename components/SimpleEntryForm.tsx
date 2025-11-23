"use client";

import React, { useState } from 'react';
import { useAppData } from '@/context/AppDataContext';
import { Save, ArrowRight, ArrowLeft, Check, X, Plus, Activity } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export const SimpleEntryForm: React.FC = () => {
    const { addDailyLog } = useAppData();
    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState(0); // -1 for back, 1 for next

    // Metrics
    const [mood, setMood] = useState(5);
    const [sleepQuality, setSleepQuality] = useState(5);
    const [sleepHours, setSleepHours] = useState(7);
    const [sleepMinutes, setSleepMinutes] = useState(0);
    const [energy, setEnergy] = useState(5);
    const [stability, setStability] = useState(5);
    const [anxiety, setAnxiety] = useState(1);

    // Text Inputs
    const [wins, setWins] = useState('');
    const [losses, setLosses] = useState('');
    const [ideas, setIdeas] = useState('');
    const [goals, setGoals] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState('');
    const [triggers, setTriggers] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [notes, setNotes] = useState('');

    const [isSaving, setIsSaving] = useState(false);

    const totalSteps = 14;

    const handleNext = () => {
        if (step < totalSteps - 1) {
            setDirection(1);
            setStep(step + 1);
        } else {
            handleSave();
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setDirection(-1);
            setStep(step - 1);
        }
    };

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
                summary: notes || "Daily Check-in",
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
                    losses: losses.split('\n').filter(c => c.trim()),
                    ideas: ideas.split('\n').filter(i => i.trim())
                },
                triggerEvents: triggers.split('\n').filter(t => t.trim()),
                symptomChecklist: symptoms.split('\n').filter(s => s.trim())
            };

            await addDailyLog(logData);
            alert("Log saved successfully!");
            // Reset or redirect could happen here
            setStep(0); // Reset to start
        } catch (e) {
            console.error(e);
            alert("Failed to save log.");
        } finally {
            setIsSaving(false);
        }
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    const renderStep = () => {
        switch (step) {
            case 0: return <SliderStep title="How's your mood?" value={mood} onChange={setMood} minLabel="Bad" maxLabel="Great" color="text-yellow-400" />;
            case 1: return <SliderStep title="Sleep Quality" value={sleepQuality} onChange={setSleepQuality} minLabel="Poor" maxLabel="Restful" color="text-purple-400" />;
            case 2: return (
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white text-center">Sleep Duration</h3>
                    <div className="flex items-center justify-center gap-4">
                        <div className="flex flex-col items-center">
                            <input
                                type="number"
                                value={sleepHours}
                                onChange={(e) => setSleepHours(Math.max(0, parseInt(e.target.value) || 0))}
                                className="w-20 h-20 bg-white/10 rounded-2xl text-3xl text-center text-white focus:outline-none focus:ring-2 focus:ring-sam-purple"
                            />
                            <span className="text-sm text-gray-400 mt-2">Hours</span>
                        </div>
                        <span className="text-2xl text-white/50">:</span>
                        <div className="flex flex-col items-center">
                            <input
                                type="number"
                                value={sleepMinutes}
                                onChange={(e) => setSleepMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                                className="w-20 h-20 bg-white/10 rounded-2xl text-3xl text-center text-white focus:outline-none focus:ring-2 focus:ring-sam-purple"
                            />
                            <span className="text-sm text-gray-400 mt-2">Minutes</span>
                        </div>
                    </div>
                </div>
            );
            case 3: return <SliderStep title="Energy Level" value={energy} onChange={setEnergy} minLabel="Low" maxLabel="High" color="text-green-400" />;
            case 4: return <SliderStep title="Stability Score" value={stability} onChange={setStability} minLabel="Unstable" maxLabel="Stable" color="text-blue-400" />;
            case 5: return <SliderStep title="Anxiety Level" value={anxiety} onChange={setAnxiety} minLabel="Low" maxLabel="High" color="text-red-400" />;
            case 6: return <TextStep title="Wins Today" value={wins} onChange={setWins} placeholder="What went well?" />;
            case 7: return <TextStep title="Losses Today" value={losses} onChange={setLosses} placeholder="What didn't go well?" />;
            case 8: return <TextStep title="New Ideas" value={ideas} onChange={setIdeas} placeholder="Any new ideas?" />;
            case 9: return <TextStep title="Goals" value={goals} onChange={setGoals} placeholder="Goals for tomorrow?" />;
            case 10: return (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white text-center">Tags</h3>
                    <div className="flex flex-wrap gap-2 justify-center min-h-[50px]">
                        {tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-sam-blue/20 border border-sam-blue/50 rounded-full text-sm text-white flex items-center gap-2">
                                #{tag}
                                <button onClick={() => setTags(tags.filter(t => t !== tag))} className="hover:text-red-400"><X size={14} /></button>
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                            placeholder="Add tag..."
                            className="flex-1 bg-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sam-blue"
                        />
                        <button onClick={handleAddTag} className="p-3 bg-sam-blue rounded-xl text-white hover:bg-blue-600">
                            <Plus size={24} />
                        </button>
                    </div>
                </div>
            );
            case 11: return <TextStep title="Trigger Events" value={triggers} onChange={setTriggers} placeholder="Any triggers?" />;
            case 12: return <TextStep title="Symptom Checklist" value={symptoms} onChange={setSymptoms} placeholder="List symptoms..." />;
            case 13: return <TextStep title="Notes" value={notes} onChange={setNotes} placeholder="Any other notes?" />;
            default: return null;
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-200px)] max-h-[600px] relative">
            {/* Progress Bar */}
            <div className="w-full h-1 bg-white/10 rounded-full mb-6 overflow-hidden">
                <motion.div
                    className="h-full bg-sam-gold"
                    initial={{ width: 0 }}
                    animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {/* Step Indicator */}
            <div className="text-center text-xs text-gray-500 mb-4 uppercase tracking-widest">
                Step {step + 1} of {totalSteps}
            </div>

            {/* Content Area */}
            <div className="flex-1 relative overflow-hidden px-4">
                <AnimatePresence initial={false} custom={direction} mode='wait'>
                    <motion.div
                        key={step}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        className="w-full h-full flex flex-col justify-center"
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-6 px-4">
                <button
                    onClick={handleBack}
                    disabled={step === 0}
                    className={clsx(
                        "p-4 rounded-full transition-colors",
                        step === 0 ? "text-gray-700 cursor-not-allowed" : "text-white hover:bg-white/10"
                    )}
                >
                    <ArrowLeft size={24} />
                </button>

                <button
                    onClick={handleNext}
                    disabled={isSaving}
                    className={clsx(
                        "flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all shadow-lg",
                        step === totalSteps - 1
                            ? "bg-sam-gold text-black hover:bg-yellow-400 shadow-yellow-500/20"
                            : "bg-sam-blue text-white hover:bg-blue-600 shadow-blue-500/20"
                    )}
                >
                    {isSaving ? (
                        <Activity className="animate-spin" />
                    ) : step === totalSteps - 1 ? (
                        <>Complete <Check size={20} /></>
                    ) : (
                        <>Next <ArrowRight size={20} /></>
                    )}
                </button>
            </div>
        </div>
    );
};

const SliderStep: React.FC<{ title: string; value: number; onChange: (v: number) => void; minLabel: string; maxLabel: string; color: string }> = ({ title, value, onChange, minLabel, maxLabel, color }) => (
    <div className="space-y-8">
        <h3 className="text-2xl font-bold text-white text-center">{title}</h3>
        <div className="px-4">
            <div className="flex justify-between text-sm text-gray-400 mb-4 font-medium uppercase tracking-wider">
                <span>{minLabel}</span>
                <span>{maxLabel}</span>
            </div>
            <input
                type="range"
                min="1"
                max="10"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className={clsx("w-full h-4 bg-gray-800 rounded-full appearance-none cursor-pointer", `accent-${color.split('-')[1]}-500`)}
                style={{ accentColor: 'currentColor' }}
            />
            <div className={clsx("text-center mt-6 text-6xl font-bold transition-colors", color)}>{value}</div>
        </div>
    </div>
);

const TextStep: React.FC<{ title: string; value: string; onChange: (v: string) => void; placeholder: string }> = ({ title, value, onChange, placeholder }) => (
    <div className="space-y-6 h-full flex flex-col">
        <h3 className="text-2xl font-bold text-white text-center">{title}</h3>
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-lg text-white placeholder-gray-600 focus:border-sam-blue outline-none resize-none"
            autoFocus
        />
    </div>
);
