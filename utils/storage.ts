export const STORAGE_KEYS = {
    LOGS: 'sam_logs',
    MOOD: 'sam_mood',
    SLEEP: 'sam_sleep',
    CHAT: 'sam_chat',
    USER_PROFILE: 'sam_user_profile',
};

export const saveToStorage = <T>(key: string, data: T): void => {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error(`Error saving to storage key "${key}":`, error);
        }
    }
};

export const getFromStorage = <T>(key: string, defaultValue: T): T => {
    if (typeof window !== 'undefined') {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Error reading from storage key "${key}":`, error);
            return defaultValue;
        }
    }
    return defaultValue;
};

export const clearStorage = (key: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
    }
};
