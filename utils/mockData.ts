import { subDays } from 'date-fns';

export interface LogEntry {
    id: string;
    date: string; // ISO string
    mood: number; // 1-10
    sleep: number; // 1-10
    sleepQuality: 'Great' | 'Okay' | 'Meh';
    notes: string[];
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const MOCK_LOGS: LogEntry[] = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    return {
        id: generateId(),
        date: date.toISOString(),
        mood: Math.floor(Math.random() * 5) + 5, // 5-10
        sleep: Math.floor(Math.random() * 4) + 6, // 6-9
        sleepQuality: ['Great', 'Okay', 'Meh'][Math.floor(Math.random() * 3)] as 'Great' | 'Okay' | 'Meh',
        notes: i === 6 ? ['Had a great workout', 'Meeting went well'] : [],
    };
});

export const MOCK_CHAT: ChatMessage[] = [
    {
        id: '1',
        role: 'assistant',
        content: 'Hello! I am Sam, your personal emotional tracker. How are you feeling today?',
        timestamp: Date.now() - 100000,
    },
    {
        id: '2',
        role: 'user',
        content: 'I am feeling pretty good, thanks!',
        timestamp: Date.now() - 50000,
    },
    {
        id: '3',
        role: 'assistant',
        content: 'That is great to hear! Remember to log your mood and sleep for today.',
        timestamp: Date.now(),
    },
];
