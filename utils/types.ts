export interface DailyLogStatus {
    moodLevel: number;
    sleepQuality: number;
    sleepDuration: number;
    energyLevel: number;
    stabilityScore: number;
}

export interface DailyLogInsights {
    wins: string[];
    losses: string[];
    ideas: string[];
}

export interface DailyLog {
    id: string;
    timestamp: string;
    summary: string;
    status: DailyLogStatus;
    insights: DailyLogInsights;
    goals: string[];
    tags: string[];
    triggerEvents: string[];
    symptomChecklist: string[];
}

export type FlowStepType = 'slider' | 'text' | 'multiselect';

export interface FlowStep {
    id: string;
    question: string;
    type: FlowStepType;
    field: string; // Dot notation path to field in DailyLog
    subField?: string; // For nested objects like status.moodLevel
    min?: number;
    max?: number;
    labels?: string[]; // For chips/multiselect
}
