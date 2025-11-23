"use client";

import React, { useState } from 'react';
import { useAppData } from '@/context/AppDataContext';
import clsx from 'clsx';
import { DailyLog } from '@/utils/types';

export const DataSettings: React.FC = () => {
    const { backupData, restoreData } = useAppData();
    const [secretKey, setSecretKey] = useState('');
    const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleBackup = async () => {
        if (!secretKey) {
            setStatus({ type: 'error', message: 'Please enter a Master Key to encrypt your backup.' });
            return;
        }
        setIsLoading(true);
        setStatus({ type: 'info', message: 'Encrypting and uploading...' });

        try {
            const result = await backupData(secretKey);
            if (result.success) {
                setStatus({ type: 'success', message: 'Backup successful! Your data is safe in the cloud.' });
            } else {
                setStatus({ type: 'error', message: result.error || 'Backup failed.' });
            }
        } catch (e) {
            setStatus({ type: 'error', message: 'An unexpected error occurred.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRestore = async () => {
        if (!secretKey) {
            setStatus({ type: 'error', message: 'Please enter your Master Key to decrypt the backup.' });
            return;
        }
        if (!confirm("WARNING: This will overwrite all current data on this device. Are you sure?")) {
            return;
        }

        setIsLoading(true);
        setStatus({ type: 'info', message: 'Downloading and decrypting...' });

        try {
            const result = await restoreData(secretKey);
            if (result.success) {
                setStatus({ type: 'success', message: `Restore successful! Recovered ${result.count} logs.` });
                setTimeout(() => window.location.reload(), 2000);
            } else {
                setStatus({ type: 'error', message: result.error || 'Restore failed.' });
            }
        } catch (e) {
            setStatus({ type: 'error', message: 'An unexpected error occurred.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleImportLegacy = async () => {
        if (!confirm("Import legacy data from 'legacy_data.json'? This will merge with existing logs.")) {
            return;
        }
        setIsLoading(true);
        setStatus({ type: 'info', message: 'Importing legacy data...' });

        try {
            const response = await fetch('/legacy_data.json');
            if (!response.ok) throw new Error('Failed to fetch legacy data file.');

            const data = await response.json();
            if (!Array.isArray(data)) throw new Error('Invalid data format. Expected an array.');

            const { db } = await import('@/utils/db');
            const { v4: uuidv4 } = await import('uuid');

            const logs = data.map((item: any) => {
                // Parse date DD/MM/YY or DD/MM/YYYY
                const [day, month, yearPart] = item.date.split('/');
                let year = parseInt(yearPart);
                if (year < 100) year += 2000; // Handle YY format

                // Handle invalid dates gracefully
                if (isNaN(year) || isNaN(parseInt(month)) || isNaN(parseInt(day))) {
                    console.warn('Skipping invalid date:', item.date);
                    return null;
                }

                const dateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

                // Try to parse content as JSON if it looks like it
                let summary = item.content;
                let moodLevel = 5;
                let energyLevel = 5;
                let tags: string[] = [];

                if (typeof item.content === 'string' && item.content.trim().startsWith('{')) {
                    try {
                        const parsed = JSON.parse(item.content);
                        if (parsed.text) summary = parsed.text;
                        if (parsed.mood) {
                            // Map mood string to number if needed, or if it's already a number
                            // For now, keep default 5 unless we have logic
                        }
                        if (parsed.tags && Array.isArray(parsed.tags)) tags = parsed.tags;
                    } catch (e) {
                        // Ignore parse error, treat as string
                    }
                }

                return {
                    id: uuidv4(),
                    date: dateStr,
                    timestamp: new Date(dateStr).toISOString(),
                    summary: summary,
                    status: {
                        moodLevel,
                        sleepQuality: 5,
                        sleepDuration: 0,
                        energyLevel,
                        stabilityScore: 5
                    },
                    insights: {
                        wins: [],
                        losses: [],
                        ideas: []
                    },
                    goals: [],
                    tags: tags,
                    triggerEvents: [],
                    symptomChecklist: []
                };
            }).filter(Boolean) as DailyLog[]; // Remove nulls and cast

            await db.logs.bulkAdd(logs);
            setStatus({ type: 'success', message: `Imported ${logs.length} legacy logs successfully!` });
            setTimeout(() => window.location.reload(), 2000);

        } catch (e: any) {
            console.error(e);
            setStatus({ type: 'error', message: e.message || 'Import failed.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-sam-card/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-white mb-1">Hybrid Vault</h3>
                <p className="text-sm text-gray-400">Securely backup your data to the cloud using client-side encryption.</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Master Key</label>
                    <input
                        type="password"
                        value={secretKey}
                        onChange={(e) => setSecretKey(e.target.value)}
                        placeholder="Enter a secure passphrase..."
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-sam-blue transition-colors"
                    />
                    <p className="text-[10px] text-gray-500 mt-1">
                        Your key is never stored. If you lose it, your backup is lost forever.
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleBackup}
                        disabled={isLoading}
                        className={clsx(
                            "flex-1 py-3 rounded-xl font-medium text-sm transition-all",
                            isLoading ? "bg-gray-700 text-gray-400 cursor-not-allowed" : "bg-sam-blue text-white hover:bg-blue-600 shadow-lg hover:shadow-blue-500/20"
                        )}
                    >
                        {isLoading ? 'Processing...' : 'Backup to Cloud'}
                    </button>
                    <button
                        onClick={handleRestore}
                        disabled={isLoading}
                        className={clsx(
                            "flex-1 py-3 rounded-xl font-medium text-sm transition-all border border-white/10",
                            isLoading ? "bg-transparent text-gray-600 cursor-not-allowed" : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                        )}
                    >
                        Restore
                    </button>
                </div>

                <div className="pt-4 border-t border-white/5">
                    <button
                        onClick={handleImportLegacy}
                        disabled={isLoading}
                        className="w-full py-2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                    >
                        Import Legacy Data (JSON)
                    </button>
                </div>

                {status && (
                    <div className={clsx(
                        "p-3 rounded-xl text-xs font-medium flex items-center gap-2",
                        status.type === 'success' ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                            status.type === 'error' ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                                "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    )}>
                        {status.type === 'success' && <span>✅</span>}
                        {status.type === 'error' && <span>❌</span>}
                        {status.type === 'info' && <span>⏳</span>}
                        {status.message}
                    </div>
                )}
            </div>
        </div>
    );
};
