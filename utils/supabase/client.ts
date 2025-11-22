import { createClient as createClientOriginal } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const createClient = () => {
    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Supabase environment variables missing. Client creation skipped.');
        return createClientOriginal('https://placeholder.supabase.co', 'placeholder');
    }
    return createClientOriginal(supabaseUrl, supabaseAnonKey);
};

export const supabase = createClient();
