const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const CryptoJS = require('crypto-js');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Error: Missing Supabase environment variables in .env.local');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const LEGACY_PATH = path.join(__dirname, '../project-sam-master 2/data/sam_google_sheets_data.json');
const MASTER_KEY = process.argv[2];

if (!MASTER_KEY) {
    console.error('Usage: node scripts/migrate_to_cloud.js <MASTER_KEY>');
    process.exit(1);
}

async function migrate() {
    console.log('🚀 Starting migration...');

    // 1. Read Legacy Data
    if (!fs.existsSync(LEGACY_PATH)) {
        console.error(`Error: Legacy file not found at ${LEGACY_PATH}`);
        process.exit(1);
    }
    const rawData = fs.readFileSync(LEGACY_PATH, 'utf8');
    const legacyData = JSON.parse(rawData);
    console.log(`✅ Loaded ${legacyData.length} legacy logs.`);

    // 2. Transform Data
    const logs = legacyData.map(item => {
        // Parse date DD/MM/YY or DD/MM/YYYY
        const parts = item.date.split('/');
        if (parts.length < 3) return null;

        let [day, month, yearPart] = parts;
        let year = parseInt(yearPart);
        if (year < 100) year += 2000;

        if (isNaN(year) || isNaN(parseInt(month)) || isNaN(parseInt(day))) return null;

        const dateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

        // Try to parse content as JSON
        let summary = item.content;
        let tags = [];

        if (typeof item.content === 'string' && item.content.trim().startsWith('{')) {
            try {
                const parsed = JSON.parse(item.content);
                if (parsed.text) summary = parsed.text;
                if (parsed.tags && Array.isArray(parsed.tags)) tags = parsed.tags;
            } catch (e) { }
        }

        return {
            id: uuidv4(),
            date: dateStr,
            timestamp: new Date(dateStr).toISOString(),
            summary: summary,
            status: {
                moodLevel: 5,
                sleepQuality: 5,
                sleepDuration: 0,
                energyLevel: 5,
                stabilityScore: 5
            },
            insights: { wins: [], losses: [], ideas: [] },
            goals: [],
            tags: tags,
            triggerEvents: [],
            symptomChecklist: []
        };
    }).filter(Boolean);

    console.log(`✅ Transformed ${logs.length} valid logs.`);

    // 3. Prepare Backup Object
    const backupData = {
        version: 1,
        timestamp: Date.now(),
        data: logs
    };

    // 4. Encrypt
    console.log('🔒 Encrypting data...');
    const jsonString = JSON.stringify(backupData);
    const encrypted = CryptoJS.AES.encrypt(jsonString, MASTER_KEY).toString();

    // 5. Upload to Supabase
    console.log('☁️ Uploading to Supabase Storage (bucket: backups)...');

    // Attempt to create bucket if it doesn't exist
    const { data: bucketData, error: bucketError } = await supabase
        .storage
        .createBucket('backups', {
            public: false, // Encrypted backups should be private usually, but for anon upload might need public or RLS
            allowedMimeTypes: ['application/json'],
            fileSizeLimit: 10485760 // 10MB
        });

    if (bucketError) {
        // Ignore error if bucket already exists
        if (!bucketError.message.includes('already exists')) {
            console.warn('⚠️ Could not create bucket (might already exist or permission denied):', bucketError.message);
        }
    } else {
        console.log('✅ Created "backups" bucket.');
    }

    const fileName = `migration_backup_${Date.now()}.json`;

    const { data, error } = await supabase
        .storage
        .from('backups')
        .upload(fileName, encrypted, {
            contentType: 'application/json',
            upsert: true
        });

    if (error) {
        console.error('❌ Upload failed:', error.message);
        console.log('Tip: Go to Supabase Dashboard -> Storage -> Create a new bucket named "backups" (Public: No).');
        console.log('Then run this script again.');
    } else {
        console.log(`✅ Success! Backup uploaded to: ${fileName}`);
        console.log('👉 Go to your App -> Profile -> Restore, enter your key, and your data will appear.');
    }
}

migrate();
