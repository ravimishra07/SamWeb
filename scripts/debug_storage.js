const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function debug() {
    console.log('🔍 Checking Supabase Storage...');
    console.log('URL:', SUPABASE_URL);

    // List Buckets
    const { data, error } = await supabase.storage.listBuckets();

    if (error) {
        console.error('❌ Error listing buckets:', error);
    } else {
        console.log('✅ Buckets found:', data.length);
        data.forEach(b => console.log(` - ${b.name} (public: ${b.public})`));
    }

    // Try to upload a dummy file
    console.log('Test upload...');
    const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('backups')
        .upload('test.txt', 'Hello World', { upsert: true });

    if (uploadError) {
        console.error('❌ Upload error:', uploadError);
    } else {
        console.log('✅ Test upload success:', uploadData);
    }
}

debug();
