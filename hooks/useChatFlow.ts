import { useState, useEffect, useCallback } from 'react';
import { CHAT_FLOW } from '../utils/flowConfig';
import { DailyLog, FlowStep } from '../utils/types';
import { useAppData } from '../context/AppDataContext';

export const useChatFlow = () => {
    const { addChatMessage, addDailyLog, chatHistory } = useAppData();
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
    const [isFlowActive, setIsFlowActive] = useState(true);

    const currentStep = CHAT_FLOW[currentStepIndex];

    useEffect(() => {
        // Initial greeting or question
        if (currentStepIndex === 0 && isFlowActive) {
            // Check if the last message from assistant is already the first question
            const lastAssistantMessage = [...chatHistory].reverse().find(m => m.role === 'assistant');
            if (lastAssistantMessage && lastAssistantMessage.content === CHAT_FLOW[0].question) {
                return;
            }

            const timer = setTimeout(() => {
                addChatMessage({
                    id: 'bot-init-' + Date.now(),
                    role: 'assistant',
                    content: CHAT_FLOW[0].question,
                    timestamp: Date.now(),
                });
            }, 500);
            return () => clearTimeout(timer);
        }
    }, []); // Run once on mount, but check history

    const handleInput = useCallback((value: string | number) => {
        if (!isFlowActive) return;

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
                // Split by comma or newline if it's a string input for a list
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

        // 3. Advance Step
        if (currentStepIndex < CHAT_FLOW.length - 1) {
            const nextStep = CHAT_FLOW[currentStepIndex + 1];
            setCurrentStepIndex((prev) => prev + 1);

            // Simulate bot typing delay
            setTimeout(() => {
                addChatMessage({
                    id: 'bot-' + (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: nextStep.question,
                    timestamp: Date.now(),
                });
            }, 600);
        } else {
            // Flow Complete
            setIsFlowActive(false);
            const finalLog: DailyLog = {
                ...draftLog,
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                triggerEvents: [],
                symptomChecklist: [],
            } as DailyLog;

            addDailyLog(finalLog);

            setTimeout(() => {
                addChatMessage({
                    id: 'bot-done-' + Date.now(),
                    role: 'assistant',
                    content: "All done! I've saved your daily log.",
                    timestamp: Date.now(),
                });
            }, 600);
        }
    }, [currentStep, currentStepIndex, isFlowActive, addChatMessage, addDailyLog, draftLog]);

    return {
        currentStep,
        handleInput,
        isFlowActive,
    };
};
