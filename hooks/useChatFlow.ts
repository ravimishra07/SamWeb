import { useState, useEffect, useCallback } from 'react';
import { CHAT_FLOW } from '../utils/flowConfig';
import { DailyLog } from '../utils/types';
import { useAppData } from '../context/AppDataContext';
import { formatDateKey } from '../utils/dateUtils';

interface UseChatFlowProps {
    selectedDate: Date;
}

export const useChatFlow = ({ selectedDate }: UseChatFlowProps) => {
    const { addChatMessage, addDailyLog, getLogForDate, clearChatHistory } = useAppData();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [draftLog, setDraftLog] = useState<Partial<DailyLog>>({
        status: {
            moodLevel: 5,
            sleepQuality: 5,
            sleepDuration: 7,
            energyLevel: 5,
            stabilityScore: 5,
        },
        insights: { wins: [], losses: [], ideas: [] },
        goals: [],
        tags: [],
    });
    const [isFlowActive, setIsFlowActive] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

    const currentStep = CHAT_FLOW[currentStepIndex];
    const dateKey = formatDateKey(selectedDate);

    // Load existing log or start new flow when date changes
    useEffect(() => {
        // Clear chat history when date changes
        clearChatHistory();
        setCurrentStepIndex(0);
        setAwaitingConfirmation(false);

        const existingLog = getLogForDate(dateKey);

        if (existingLog) {
            // View mode: Display existing log data
            setIsViewMode(true);
            setIsFlowActive(false);
            setDraftLog(existingLog);

            // Display the log data in chat
            setTimeout(() => {
                addChatMessage({
                    id: 'view-mode-' + Date.now(),
                    role: 'assistant',
                    content: `Here's your log for ${selectedDate.toLocaleDateString()}:`,
                    timestamp: Date.now(),
                });
            }, 300);

            setTimeout(() => {
                addChatMessage({
                    id: 'log-summary-' + Date.now(),
                    role: 'assistant',
                    content: formatLogForDisplay(existingLog),
                    timestamp: Date.now(),
                });
            }, 600);
        } else {
            // Edit mode: Start new flow
            setIsViewMode(false);
            setIsFlowActive(true);
            setDraftLog({
                status: {
                    moodLevel: 5,
                    sleepQuality: 5,
                    sleepDuration: 7,
                    energyLevel: 5,
                    stabilityScore: 5,
                },
                insights: { wins: [], losses: [], ideas: [] },
                goals: [],
                tags: [],
            });

            // Start the flow
            setTimeout(() => {
                addChatMessage({
                    id: 'bot-init-' + Date.now(),
                    role: 'assistant',
                    content: CHAT_FLOW[0].question,
                    timestamp: Date.now(),
                });
            }, 300);
        }
    }, [selectedDate, dateKey]);

    const handleInput = useCallback((value: string | number) => {
        if (!isFlowActive) return;

        // If awaiting confirmation
        if (awaitingConfirmation) {
            const response = value.toString().toLowerCase();

            // Add user response
            addChatMessage({
                id: Date.now().toString(),
                role: 'user',
                content: value.toString(),
                timestamp: Date.now(),
            });

            if (response === 'yes' || response === 'y' || response === 'save') {
                // Save the log
                const finalLog: DailyLog = {
                    ...draftLog,
                    id: Date.now().toString(),
                    date: dateKey,
                    timestamp: new Date().toISOString(),
                    triggerEvents: [],
                    symptomChecklist: [],
                } as DailyLog;

                addDailyLog(finalLog);
                setIsFlowActive(false);
                setAwaitingConfirmation(false);

                setTimeout(() => {
                    addChatMessage({
                        id: 'bot-saved-' + Date.now(),
                        role: 'assistant',
                        content: `✅ Log saved for ${selectedDate.toLocaleDateString()}! You can view it by selecting this date from the calendar.`,
                        timestamp: Date.now(),
                    });
                }, 600);
            } else {
                // User said no, ask what they want to do
                setAwaitingConfirmation(false);
                setTimeout(() => {
                    addChatMessage({
                        id: 'bot-cancelled-' + Date.now(),
                        role: 'assistant',
                        content: "No problem! The data hasn't been saved. Select a different date to start over.",
                        timestamp: Date.now(),
                    });
                }, 600);
                setIsFlowActive(false);
            }
            return;
        }

        // 1. Add User Message
        addChatMessage({
            id: Date.now().toString(),
            role: 'user',
            content: value.toString(),
            timestamp: Date.now(),
        });

        // 2. Update Draft Log
        setDraftLog((prev) => {
            const newLog = { ...prev };
            const step = currentStep;

            if (step.field === 'status') {
                // @ts-ignore
                newLog.status[step.subField!] = Number(value);
            } else if (step.field === 'insights') {
                // @ts-ignore
                const currentArray = newLog.insights[step.subField!] || [];
                const newValues = typeof value === 'string' ? value.split(/,|\n/).map(s => s.trim()).filter(Boolean) : [value];
                // @ts-ignore
                newLog.insights[step.subField!] = [...currentArray, ...newValues];
            } else if (step.field === 'goals' || step.field === 'tags') {
                const newValues = typeof value === 'string' ? value.split(/,|\n/).map(s => s.trim()).filter(Boolean) : [value];
                // @ts-ignore
                newLog[step.field] = newValues;
            } else {
                // @ts-ignore
                newLog[step.field] = value;
            }
            return newLog;
        });

        // 3. Advance Step or Ask for Confirmation
        if (currentStepIndex < CHAT_FLOW.length - 1) {
            const nextStep = CHAT_FLOW[currentStepIndex + 1];
            setCurrentStepIndex((prev) => prev + 1);

            setTimeout(() => {
                addChatMessage({
                    id: 'bot-' + (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: nextStep.question,
                    timestamp: Date.now(),
                });
            }, 600);
        } else {
            // All questions answered, ask for confirmation
            setAwaitingConfirmation(true);
            setTimeout(() => {
                addChatMessage({
                    id: 'bot-confirm-' + Date.now(),
                    role: 'assistant',
                    content: `Great! I've collected all your responses for ${selectedDate.toLocaleDateString()}. Ready to save this log? (Type "yes" to save)`,
                    timestamp: Date.now(),
                });
            }, 600);
        }
    }, [currentStep, currentStepIndex, isFlowActive, awaitingConfirmation, addChatMessage, addDailyLog, draftLog, dateKey, selectedDate]);

    return {
        currentStep,
        handleInput,
        isFlowActive,
        isViewMode,
        awaitingConfirmation,
    };
};

// Helper function to format log for display
function formatLogForDisplay(log: DailyLog): string {
    return `
📊 **Summary**: ${log.summary || 'N/A'}

😊 **Mood**: ${log.status.moodLevel}/10
😴 **Sleep Quality**: ${log.status.sleepQuality}/10
⏰ **Sleep Duration**: ${log.status.sleepDuration} hours
⚡ **Energy**: ${log.status.energyLevel}/10
🎯 **Stability**: ${log.status.stabilityScore}/10

🏆 **Wins**: ${log.insights.wins.length > 0 ? log.insights.wins.join(', ') : 'None'}
📉 **Challenges**: ${log.insights.losses.length > 0 ? log.insights.losses.join(', ') : 'None'}
💡 **Ideas**: ${log.insights.ideas.length > 0 ? log.insights.ideas.join(', ') : 'None'}

🎯 **Goals**: ${log.goals.length > 0 ? log.goals.join(', ') : 'None'}
🏷️ **Tags**: ${log.tags.length > 0 ? log.tags.join(', ') : 'None'}
    `.trim();
}
