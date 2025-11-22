"use client";

import React, { useState } from 'react';
import { useAppData } from '@/context/AppDataContext';
import clsx from 'clsx';

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
