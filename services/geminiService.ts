
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might want to handle this more gracefully.
  // For this context, we assume the API key is always available.
  console.warn("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const suggestHeadingLevel = async (text: string): Promise<1 | 2 | 3 | 4 | 5 | 6> => {
  if (!text.trim()) {
    return 1;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Based on the following text, what is the most appropriate HTML heading level (1-6)? For example, a main title should be 1, a major section 2, and a subsection 3.\n\nText: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            level: {
              type: Type.INTEGER,
              description: "An integer between 1 and 6.",
            },
          },
          required: ["level"],
        },
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    const level = result.level;
    if (level >= 1 && level <= 6) {
      return level as (1 | 2 | 3 | 4 | 5 | 6);
    }
    return 1; // Fallback
  } catch (error) {
    console.error("Error suggesting heading level:", error);
    return 1; // Fallback on error
  }
};

export const suggestImageAltText = async (base64DataUrl: string): Promise<string> => {
  if (!base64DataUrl) {
    return "";
  }

  try {
    const [header, data] = base64DataUrl.split(',');
    if (!header || !data) {
      throw new Error("Invalid base64 data URL");
    }
    const mimeTypeMatch = header.match(/:(.*?);/);
    if (!mimeTypeMatch || !mimeTypeMatch[1]) {
       throw new Error("Could not determine MIME type from data URL");
    }
    const mimeType = mimeTypeMatch[1];
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          { text: "Describe this image to be used as alt text for web accessibility. Be concise and descriptive." },
          {
            inlineData: {
              mimeType,
              data,
            },
          },
        ],
      },
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error suggesting image alt text:", error);
    return ""; // Fallback on error
  }
};
