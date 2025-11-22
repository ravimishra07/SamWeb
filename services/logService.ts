import { supabase } from '@/utils/supabase/client';
import { DailyLog } from '@/utils/types';

export interface SupabaseLog {
    id?: string;
    user_id?: string;
    ts: string;
    mood: number;
    sleep_quality: number;
    energy: number;
    stability: number;
    notes: string;
    meta: any;
    attachments: string[];
}

export const logService = {
    /**
     * Uploads a file to the private 'attachments' bucket using a signed URL from Edge Function.
     */
    async uploadAttachment(file: File, userId: string): Promise<string> {
        try {
            // 1. Get signed upload URL from Edge Function
            const { data, error } = await supabase.functions.invoke('get-signed-upload-url', {
                body: { filename: file.name, filetype: file.type },
            });

            if (error) throw error;
            if (!data?.signedUrl || !data?.path) throw new Error('Invalid response from edge function');

            // 2. Upload file to signed URL
            const uploadResponse = await fetch(data.signedUrl, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type,
                },
            });

            if (!uploadResponse.ok) {
                throw new Error(`Upload failed: ${uploadResponse.statusText}`);
            }

            return data.path;
        } catch (err) {
            console.error('Error uploading attachment:', err);
            throw err;
        }
    },

    /**
     * Inserts a new log entry into the database.
     */
    async addLog(log: DailyLog, attachments: string[] = []) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const dbLog: SupabaseLog = {
            user_id: user.id,
            ts: new Date().toISOString(),
            mood: log.status.moodLevel,
            sleep_quality: log.status.sleepQuality,
            energy: log.status.energyLevel,
            stability: log.status.stabilityScore,
            notes: log.summary,
            meta: {
                wins: log.insights.wins,
                challenges: log.insights.losses,
                thoughts: log.insights.ideas,
                goals: log.goals,
                tags: log.tags,
                date: log.date,
            },
            attachments,
        };

        const { data, error } = await supabase
            .from('logs')
            .insert(dbLog)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Fetches logs for the current user.
     */
    async getLogs() {
        const { data, error } = await supabase
            .from('logs')
            .select('*')
            .order('ts', { ascending: false });

        if (error) throw error;
        return data;
    }
};
