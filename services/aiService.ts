import Groq from "groq-sdk";
import { DailyLog } from "../utils/types";

// Initialize Groq
// NOTE: In a real production app, you should call via a backend API to hide the key.
// For this local-first personal app, using NEXT_PUBLIC is acceptable for ease of use.
const API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || "";
const groq = new Groq({ apiKey: API_KEY, dangerouslyAllowBrowser: true });

export interface AIResponse {
    message: string;
    relevantLogId?: string;
}

export const chatWithGroq = async (query: string, logs: DailyLog[]): Promise<AIResponse> => {
    if (!API_KEY) {
        return { message: "Please add your Groq API Key to .env.local as NEXT_PUBLIC_GROQ_API_KEY" };
    }

    try {
        // Prepare context from logs (limit to last 5 logs for concise response)
        const context = logs.slice(0, 5).map(log => `
Date: ${log.date}
Summary: ${log.summary}
Mood: ${log.status.moodLevel}/10
Energy: ${log.status.energyLevel}/10
`).join("\n---\n");

        const prompt = `
You are SAM, a concise personal emotional health assistant.
Here is the user's recent log history:
${context}

User Query: "${query}"

Instructions:
- Respond **ONLY** with bullet points. No greetings or paragraphs.
- Each bullet ≤ 20 words.
- Use **bold** for dates or key feelings.
- End output after the last bullet.
`;

        const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            temperature: 0.2,
            max_tokens: 200,
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        const text = completion.choices[0]?.message?.content || "I couldn't generate a response.";
        return { message: text };
    } catch (error) {
        console.error("Groq API Error:", error);
        return { message: "Sorry, I had trouble connecting to my brain (Groq API). Please check your connection or API key." };
    }
};
