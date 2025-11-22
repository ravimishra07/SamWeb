# SAM Web App - Project Status Report

**Date**: November 23, 2025
**Status**: Active Development / Feature Complete (Phase 1 & 2)

## Executive Summary
The SAM Web App has evolved into a sophisticated, local-first personal tracking and insights platform. It combines a conversational interface for effortless data entry with a powerful "Insights 2.0" dashboard for deep analysis. The app is built with a premium, glassmorphic UI and leverages local AI (Groq) for smart search and interaction.

## Core Features

### 1. Conversational Logging (Home Tab)
- **Natural Language Entry**: Users log data by chatting with "SAM".
- **Structured Data Capture**: The chat flow automatically extracts Mood, Sleep, Energy, Stability, and Tags.
- **Log Cards**: Entries are displayed as beautiful, glassmorphic cards with visual stats (rings/bars) and structured summaries.
- **Smart Search**: A toggle allows users to switch between "Log Mode" and "Search Mode". Search uses AI to find relevant past logs based on natural language queries.

### 2. SAM Insights 2.0 (Insights Tab)
- **Vertical Stacked Graphs**: Individual trend lines for Mood, Sleep Quality, Sleep Duration, Energy, and Emotional Stability.
- **Correlation Engine**: A powerful "Compare with..." feature allows users to overlay ANY two metrics to find hidden patterns (e.g., Mood vs. Sleep Duration).
- **Context Injection**:
    - **Event Markers**: Vertical lines indicating major life events.
    - **Tag Overlays**: Red dots on graph nodes when high-impact tags (e.g., #anxiety, #insomnia) are present.
- **Interactive Charts**:
    - **Scrubbing**: Drag-to-read tooltips with precise data.
    - **Time Travel**: Switch between 7D, 30D, 90D, and ALL time ranges.
    - **Smart Axes**: Dynamic scaling and date formatting based on the selected range.

### 3. Technical Architecture
- **Framework**: Next.js 16 (App Router) with TypeScript.
- **Styling**: Tailwind CSS with custom glassmorphism utilities (`bg-sam-card`, `backdrop-blur`).
- **State Management**: React Context (`AppDataContext`) for global state (logs, chat history).
- **Data Persistence**: Local Storage (primary) + Supabase (optional/backup).
- **AI Integration**: Groq API (`llama-3.1-8b-instant`) for fast, low-latency chat and search.
- **Charting**: Recharts for high-performance, customizable data visualization.

## Recent Upgrades (Session Highlights)
- **Correlation Engine**: Transformed "God Mode" into a flexible comparison tool.
- **Duplicate Key Fix**: Implemented robust ID generation to prevent chat errors.
- **Mobile Navigation**: Fixed bottom tab styling to match native mobile app standards.
- **Visual Polish**: Removed clutter ("Recent Wins") to focus on data visualization.

## Next Steps (Proposed)
- **Finance Integration**: Visualize the parsed finance data in a dedicated section.
- **Profile Tab**: Implement user settings and data export/import.
- **PWA Support**: Make the app installable as a Progressive Web App.
