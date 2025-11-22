import { useState, useCallback } from 'react';
import { useAppData } from '../context/AppDataContext';
import { chatWithGroq } from '../services/aiService';

// Hook for AI-powered search using Groq
export const useSmartSearch = () => {
    const { logs, addChatMessage } = useAppData();
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = useCallback(async (query: string) => {
        setIsSearching(true);

        try {
            const response = await chatWithGroq(query, logs);

            addChatMessage({
                id: 'ai-response-' + Date.now(),
                role: 'assistant',
                content: response.message,
                timestamp: Date.now()
            });

        } catch (error) {
            addChatMessage({
                id: 'ai-error-' + Date.now(),
                role: 'assistant',
                content: "I encountered an error while thinking. Please try again.",
                timestamp: Date.now()
            });
        } finally {
            setIsSearching(false);
        }
    }, [logs, addChatMessage]);

    return {
        handleSearch,
        isSearching
    };
};
