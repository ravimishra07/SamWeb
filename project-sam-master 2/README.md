## Project Sam — Daily Logging Only

This repository is a simple personal logging system. The only intended workflow is to add one structured JSON entry per day to `data/CleanedDaily/`. Everything else in the repo is secondary.

---

## What you do every day

- **Add today’s log** to `data/CleanedDaily/` as a new JSON file
- **Never edit past logs** once written (treat as append‑only)

---

## Folder of truth

- `data/CleanedDaily/` — daily JSON logs (append‑only)

Optional exports (auto or manual):
- `data/exports/` — summaries or briefs generated from logs

---

## File naming

Use the existing sequence pattern to keep ordering stable. Examples from the repo:
- `63-19-08-2025.json`
- `69-28-09-2025.json`

Recommended convention:
- `<sequence>-<DD>-<MM>-<YYYY>.json`

The sequence number increments by 1 each day.

---

## JSON structure

Keep the structure consistent so simple scripts can analyze it later.

```json
{
  "timestamp": "YYYY-MM-DDThh:mm:ssZ",
  "summary": "One-paragraph summary of the day",
  "status": {
    "moodLevel": "1-10",
    "sleepQuality": "1-10",
    "sleepDuration": "hours",
    "energyLevel": "1-10",
    "stabilityScore": "1-10"
  },
  "insights": {
    "wins": [],
    "losses": [],
    "ideas": []
  },
  "goals": [],
  "tags": [],
  "triggerEvents": [],
  "symptomChecklist": []
}
```

If a field doesn’t apply that day, keep it as an empty list or an empty string. Do not remove keys.

---

## Do’s and Don’ts

- Do: add exactly one new file per day
- Do: keep keys consistent across days
- Do: store sensitive details only locally (this repo is personal)
- Don’t: modify or delete previous logs
- Don’t: change the naming convention retroactively

---

## Quick add (manual)

1) Duplicate yesterday’s file in `data/CleanedDaily/`
2) Update filename to today’s sequence and date
3) Update `timestamp`, `summary`, and fields

---

## Admin notes

- Past README content about interview prep and curricula is intentionally removed; the scope is now only daily logging.
- If you later add scripts or exports, put outputs in `data/exports/` and keep logs immutable.
