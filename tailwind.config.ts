import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class", // enable class‑based dark mode
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                // Custom palette (HSL for easy theming)
                primary: "hsl(210, 80%, 55%)",
                secondary: "hsl(210, 30%, 45%)",
                accent: "hsl(340, 80%, 60%)",
                sam: {
                    dark: "#0d0d0d",
                    gray: "#1a1a1a",
                    card: "rgba(30,30,30,0.5)",
                    blue: {
                        DEFAULT: "#3b82f6",
                        glow: "#60a5fa",
                        dark: "#1d4ed8",
                    },
                    text: {
                        primary: "#ffffff",
                        secondary: "#9ca3af",
                        muted: "#4b5563",
                    },
                },
            },
            backdropBlur: {
                xs: "2px",
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
            },
            animation: {
                "pulse-slow": "pulse 3s ease-in-out infinite",
            },
            backgroundImage: {
                "chat-gradient": "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                "app-gradient": "linear-gradient(to bottom, #1a1a1a 0%, #0d0d0d 100%)",
            },
        },
    },
    plugins: [],
};

export default config;
