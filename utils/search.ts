import { DailyLog } from './types';
import * as chrono from 'chrono-node';
import { format } from 'date-fns';

export interface SearchResult {
    log: DailyLog;
    score: number;
    matches: string[];
}

/**
 * Searches logs for a given query string.
 * Uses a simple scoring algorithm based on keyword presence in summary, tags, and insights.
 */
export const searchLogs = (logs: DailyLog[], query: string): SearchResult[] => {
    if (!query.trim()) return [];

    // 1. Try to parse a date from the query
    const parsedDate = chrono.parseDate(query);
    let targetDateStr = '';
    if (parsedDate) {
        // Format to YYYY-MM-DD to match log.date
        // Note: chrono parses "21 november" as current year's 21 nov.
        // If the user says "last november", it handles it.
        targetDateStr = format(parsedDate, 'yyyy-MM-dd');
    }

    const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);

    const results = logs.map(log => {
        let score = 0;
        const matches: Set<string> = new Set();

        // Date Match (Highest Priority)
        if (targetDateStr && log.date === targetDateStr) {
            score += 500; // Massive boost for exact date match
            matches.add('Date match');
        }

        const summary = (log.summary || '').toLowerCase();
        const tags = (log.tags || []).map(t => t.toLowerCase());
        const wins = (log.insights.wins || []).map(w => w.toLowerCase());
        const losses = (log.insights.losses || []).map(l => l.toLowerCase());
        const ideas = (log.insights.ideas || []).map(i => i.toLowerCase());

        terms.forEach(term => {
            // Skip terms that were part of the date (heuristic)
            if (targetDateStr && (term.includes('nov') || term.includes('21'))) return;

            // Summary match
            if (summary.includes(term)) {
                score += 10;
                matches.add('Summary');
            }

            // Tag match
            if (tags.some(t => t.includes(term))) {
                score += 15;
                matches.add(`Tag: ${term}`);
            }

            // Insight match
            if (wins.some(w => w.includes(term)) || losses.some(l => l.includes(term)) || ideas.some(i => i.includes(term))) {
                score += 5;
                matches.add('Insights');
            }

            // Mood/Status checks
            if (term === 'energy' && (query.includes('high') || query.includes('good'))) {
                if (log.status.energyLevel >= 7) score += 5;
            }
            if (term === 'energy' && (query.includes('low') || query.includes('bad') || query.includes('tired'))) {
                if (log.status.energyLevel <= 4) score += 5;
            }
            if ((term === 'sad' || term === 'bad' || term === 'depressed') && log.status.moodLevel <= 4) score += 5;
            if ((term === 'happy' || term === 'good' || term === 'great') && log.status.moodLevel >= 7) score += 5;
        });

        return { log, score, matches: Array.from(matches) };
    });

    // Filter by score > 0 and sort by score desc, then date desc
    return results
        .filter(r => r.score > 0)
        .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return new Date(b.log.date).getTime() - new Date(a.log.date).getTime();
        });
};
