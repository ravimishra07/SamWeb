import type { Config } from "tailwindcss";

const config: Config = {
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
                // Custom colors from UI Spec
                sam: {
                    dark: "#0d0d0d", // Deepest background
                    gray: "#1a1a1a", // Lighter background
                    card: "rgba(30, 30, 30, 0.5)", // Glassy card
                    blue: {
                        DEFAULT: "#3b82f6", // Primary Blue
                        glow: "#60a5fa", // Lighter blue for glows
                        dark: "#1d4ed8", // Darker blue
                    },
                    text: {
                        primary: "#ffffff",
                        secondary: "#9ca3af",
                        muted: "#4b5563",
                    },
                },
            },
            fontFamily: {
                sans: ["var(--font-geist-sans)", "sans-serif"],
                mono: ["var(--font-geist-mono)", "monospace"],
            },
            backgroundImage: {
                'chat-gradient': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                'app-gradient': 'linear-gradient(to bottom, #1a1a1a 0%, #0d0d0d 100%)',
            },
        },
    },
    plugins: [],
};
export default config;
