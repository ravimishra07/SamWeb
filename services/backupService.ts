import { createClient } from '@/utils/supabase/client';
import { db } from '@/utils/db';
import { encryptData, decryptData } from '@/utils/encryption';
import { DailyLog } from '@/utils/types';

const BUCKET_NAME = 'backups';

export const backupService = {
    /**
     * Creates an encrypted backup of all local logs and uploads to Supabase.
     */
    async backupToCloud(secretKey: string): Promise<{ success: boolean; error?: string }> {
        try {
            // 1. Get all local data
            const logs = await db.logs.toArray();

            if (logs.length === 0) {
                return { success: false, error: 'No local data to backup.' };
            }

            // 2. Encrypt data
            const backupData = {
                timestamp: Date.now(),
                logs: logs
            };
            const encrypted = encryptData(backupData, secretKey);

            // 3. Upload to Supabase
            const supabase = createClient();
            const fileName = `backup_${Date.now()}.sam`;

            const { error } = await supabase
                .storage
                .from(BUCKET_NAME)
                .upload(fileName, encrypted, {
                    contentType: 'text/plain',
                    upsert: true
                });

            if (error) throw error;

            return { success: true };
        } catch (error: any) {
            console.error('Backup failed:', error);
            return { success: false, error: error.message || 'Backup failed' };
        }
    },

    /**
     * Restores data from the latest cloud backup.
     * WARNING: This overwrites local data.
     */
    async restoreFromCloud(secretKey: string): Promise<{ success: boolean; error?: string; count?: number }> {
        try {
            const supabase = createClient();

            // 1. List backups to find the latest
            const { data: files, error: listError } = await supabase
                .storage
                .from(BUCKET_NAME)
                .list('', { limit: 1, sortBy: { column: 'created_at', order: 'desc' } });

            if (listError) throw listError;
            if (!files || files.length === 0) {
                return { success: false, error: 'No backups found.' };
            }

            const latestFile = files[0];

            // 2. Download the file
            const { data: blob, error: downloadError } = await supabase
                .storage
                .from(BUCKET_NAME)
                .download(latestFile.name);

            if (downloadError) throw downloadError;

            // 3. Decrypt
            const encryptedText = await blob.text();
            const decryptedData = decryptData<{ timestamp: number; logs: DailyLog[] }>(encryptedText, secretKey);

            if (!decryptedData || !decryptedData.logs) {
                return { success: false, error: 'Decryption failed. Invalid key or corrupted file.' };
            }

            // 4. Restore to Dexie (Transaction for safety)
            await db.transaction('rw', db.logs, async () => {
                await db.logs.clear();
                await db.logs.bulkAdd(decryptedData.logs);
            });

            return { success: true, count: decryptedData.logs.length };
        } catch (error: any) {
            console.error('Restore failed:', error);
            return { success: false, error: error.message || 'Restore failed' };
        }
    }
};
