import { GoogleGenAI, Chat, Content } from "@google/genai";

const apiKey = import.meta.env.VITE_API_KEY;

// Initialize AI only if API key is available
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

if (!ai) {
    console.warn("Gemini VITE_API_KEY not set in environment variables. AI features will be disabled.");
}

let chat: Chat | null = null;
let lastSystemInstruction = '';

export const getAiResponse = async (
    prompt: string,
    history: Content[],
    modelName: string,
    siteName: string,
    tagline: string
): Promise<string> => {
    // Check if the AI client was successfully initialized.
    if (!ai) {
        return "AI features are not configured. Please add your Gemini API Key to your environment variables.";
    }

    const systemInstruction = `You are a helpful AI assistant for ${siteName}. Our tagline is "${tagline}". Your goal is to answer questions about the company's services (AI systems, branding, websites, etc.) and encourage users to start a project. Keep your answers concise, friendly, and professional.`;

    // Reset chat if system instruction (branding info) changes
    if (lastSystemInstruction !== systemInstruction) {
        chat = null;
        lastSystemInstruction = systemInstruction;
    }

    try {
        if (!chat) {
            chat = ai.chats.create({
                model: modelName,
                history: history,
                config: {
                    systemInstruction: systemInstruction,
                }
            });
        }
        
        const result = await chat.sendMessage({ message: prompt });
        return result.text;
    } catch (error) {
        console.error("Gemini API error:", error);
        // Reset chat on error
        chat = null;
        return "An error occurred while communicating with the AI. Please try again.";
    }
};
