# SAM - Emotional Self-Tracking App

A mobile-first, emotional self-tracking chat application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Daily Logging**: Track your mood and sleep with interactive sliders.
- **Chat Interface**: Chat with an AI assistant (simulated) about your day.
- **Data Persistence**: All data is stored locally in your browser.
- **Calendar View**: Scroll through past days to view logs.
- **Insights & Sensor Data**: Placeholder pages for future expansion.
- **Profile**: Export your data as JSON.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Testing**: Vitest + React Testing Library

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run the development server**:
    ```bash
    npm run dev
    ```

3.  **Open the app**:
    Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Testing

Run the unit tests with:

```bash
npm test
```

## Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable UI components.
- `context/`: Global state management.
- `utils/`: Helper functions (storage, dates, mock data).
- `tests/`: Unit tests.
- `styles/`: Global styles and Tailwind config.

## Customization

- **Colors**: Adjusted in `tailwind.config.ts` under `colors.sam`.
- **Typography**: Uses `Inter` font via `next/font/google`.
