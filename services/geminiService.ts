
import { GoogleGenAI, Chat } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateColoringPages = async (prompt: string): Promise<string[]> => {
  try {
    const fullPrompt = `Coloring book page for a child, thick black outlines, simple, clean, white background. The drawing should be of: ${prompt}`;
    
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: fullPrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '4:3',
      },
    });

    return response.generatedImages.map(img => `data:image/png;base64,${img.image.imageBytes}`);
  } catch (error) {
    console.error("Error generating images:", error);
    throw new Error("Failed to generate images from Gemini API.");
  }
};

let chat: Chat | null = null;

export const getChatSession = (): Chat => {
    if (!chat) {
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: 'You are a friendly and helpful assistant for parents and kids using a coloring book app. Keep your answers concise and cheerful.',
            },
        });
    }
    return chat;
};

export const sendMessageToBot = async (message: string): Promise<string> => {
    try {
        const chatSession = getChatSession();
        const response = await chatSession.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error sending message to bot:", error);
        return "Oops! I'm having a little trouble thinking right now. Please try again in a moment.";
    }
};
