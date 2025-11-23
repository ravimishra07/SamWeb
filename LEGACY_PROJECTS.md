# Legacy Projects Documentation

This document serves as a record of the legacy projects and data that were previously part of the codebase but have been removed to clean up the repository.

## 1. ProjectSamApp-master (Android App)
**Path:** `ProjectSamApp-master/`
**Type:** Android Studio Project (Kotlin/Java)

### Overview
This was the original native Android application for SAM. It featured a "Wizard" style entry flow and local database storage.

### Key Features
- **14-Step Entry Wizard**: A "swipage" interface for logging daily metrics.
- **Metrics Tracked**: Mood, Sleep Quality, Sleep Duration, Energy, Stability, Anxiety.
- **Text Inputs**: Wins, Losses, Ideas, Goals, Tags, Triggers, Symptoms, Notes.
- **Architecture**: MVVM with Room Database.

### Key Files Preserved in Web App
- **UI Logic**: The 14-step wizard logic was ported to `components/SimpleEntryForm.tsx`.
- **Data Model**: The data structure (Mood, Sleep, etc.) was adapted into the `DailyLog` interface in `utils/types.ts`.

---

## 2. project-sam-master 2 (Legacy Data)
**Path:** `project-sam-master 2/`
**Type:** Data Archive

### Overview
This folder contained historical data and medication logs from previous versions of the project.

### Contents
- **`heath_info.md`**: A log of medication history (Sertan, Lithosun, etc.) from 2023-2025.
- **`data/CleanedDaily/`**: A collection of JSON files representing daily logs (e.g., `20-11-6-2025.json`).
- **`data/sam_google_sheets_data.json`**: A large JSON dump of past entries.
- **`data/google_sheets_data/samdaily.csv`**: CSV export of daily logs.

### Migration Status
- **Medication History**: Preserved in this document (see below).
- **Daily Logs**: The schema has been migrated to the new web app's `DailyLog` format.

### Medication History (Archived from `heath_info.md`)
* **June 20, 2023**: Sertan (50), Bupioset (150), Valvo-CR (500), Monolith-CR (450), Maltee (5), Seropax (12.5)
* **September 1, 2023**: Sertan (50), Bupriolex (150), Valvo-CR (500), Monolith (450), Seropax (12.5)
* **November 1, 2023**: Sertan (50), Bupioset (150), Valvo-CR (500), Monolith CR (450), Maltee (5), Seropax (12.5)
* **January 3, 2024**: Sertan (50), Bupioset (150), Genval-OD (1gm), Monolith -SR (450), Mygranol TR (20), Maltee (10), Seropax (12.5)
* **June 23, 2024**: Lithosun 450mg, Lamitor DT 50mg, Bupron XL 150mg, Serta 100mg, Quetiapine 200mg
* **August 18, 2024**: Lithosun 450mg, Lamitor DT 50mg, Bupron XL 150mg, Serta 100mg
* **August 3, 2024**: Lithosyn SR 450mg, Lamez OD 50mg, Carispec 1.5mg
* **August 5, 2025**: Tab Lithosun SR 450, Bupron XL 150 Tablet, Clonotril 0.25mg Tablet DT
