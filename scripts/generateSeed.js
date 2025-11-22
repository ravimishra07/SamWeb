const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(__dirname, '../project-sam-master 2/data/CleanedDaily');
const OUTPUT_FILE = path.join(__dirname, '../utils/seedData.ts');

function generateSeed() {
    console.log(`Reading logs from ${SOURCE_DIR}...`);

    if (!fs.existsSync(SOURCE_DIR)) {
        console.error(`Source directory not found: ${SOURCE_DIR}`);
        process.exit(1);
    }

    const files = fs.readdirSync(SOURCE_DIR).filter(file => file.endsWith('.json'));
    const logs = [];

    files.forEach(file => {
        try {
            const content = fs.readFileSync(path.join(SOURCE_DIR, file), 'utf8');
            const log = JSON.parse(content);

            // Basic validation/transformation if needed
            // Ensure ID exists or generate one (though these are historical, so maybe just use date as ID or generate UUID)
            // For now, we'll assume the app generates IDs or we can generate a simple one based on date.

            // Map to DailyLog interface roughly
            // The current app expects: id, date, timestamp, summary, status, insights, goals, tags, etc.
            // The JSONs have: timestamp, summary, status, insights, goals, tags...
            // We need to extract 'date' from filename or timestamp.

            // Filename format: sequence-DD-MM-YYYY.json (e.g., 78-19-11-2025.json)
            // Or timestamp: "2025-11-19T21:46:23Z"

            let dateStr = '';
            if (log.timestamp) {
                dateStr = log.timestamp.split('T')[0];
            } else {
                // Fallback to parsing filename
                const parts = file.replace('.json', '').split('-');
                if (parts.length >= 4) {
                    // 78-19-11-2025 -> 2025-11-19
                    dateStr = `${parts[3]}-${parts[2]}-${parts[1]}`;
                }
            }

            const newLog = {
                id: `seed-${dateStr}`, // Simple ID
                date: dateStr,
                timestamp: log.timestamp || new Date(dateStr).toISOString(),
                summary: log.summary || '',
                status: {
                    moodLevel: parseInt(log.status?.moodLevel || '5'),
                    sleepQuality: parseInt(log.status?.sleepQuality || '5'),
                    sleepDuration: parseFloat(log.status?.sleepDuration || '0'),
                    energyLevel: parseInt(log.status?.energyLevel || '5'),
                    stabilityScore: parseInt(log.status?.stabilityScore || '5'),
                },
                insights: {
                    wins: log.insights?.wins || [],
                    losses: log.insights?.losses || [],
                    ideas: log.insights?.ideas || [],
                },
                goals: log.goals || [],
                tags: log.tags || [],
                triggerEvents: log.triggerEvents || [],
                symptomChecklist: log.symptomChecklist || [],
            };

            logs.push(newLog);
        } catch (err) {
            console.warn(`Skipping file ${file}: ${err.message}`);
        }
    });

    // Sort by date descending
    logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const fileContent = `import { DailyLog } from './types';

export const seedData: DailyLog[] = ${JSON.stringify(logs, null, 2)};
`;

    fs.writeFileSync(OUTPUT_FILE, fileContent);
    console.log(`Successfully generated seed data with ${logs.length} logs at ${OUTPUT_FILE}`);
}

generateSeed();
