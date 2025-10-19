
import { GoogleGenAI, Type } from "@google/genai";
import { CheckStatus, CheckResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    status: {
      type: Type.STRING,
      description: "The final status of the website, must be either 'UP' or 'DOWN'.",
    },
    statusCode: {
      type: Type.INTEGER,
      description: "The HTTP status code received when trying to access the site. Use 0 if not accessible or no response.",
    },
    reason: {
      type: Type.STRING,
      description: "A brief, human-readable explanation for the status (e.g., 'OK', 'Not Found', 'Connection Timed Out').",
    },
  },
  required: ['status', 'statusCode', 'reason'],
};

interface GeminiResponse {
  status: 'UP' | 'DOWN';
  statusCode: number;
  reason: string;
}

export const checkWebsiteStatus = async (url: string): Promise<Partial<CheckResult>> => {
  try {
    const prompt = `
      Please act as a website availability checker.
      Analyze the website at the URL: "${url}".
      Determine if it is currently online and accessible from a standard network perspective.
      Provide the HTTP status code you received. If you cannot connect, use 0 as the status code.
      Return your findings in the requested JSON format with a final status of 'UP' or 'DOWN'.
      A site is 'DOWN' if it has a 5xx error, times out, or cannot be resolved.
      A site is 'UP' if it returns any other status code (2xx, 3xx, 4xx).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsed: GeminiResponse = JSON.parse(jsonText);
    
    if (parsed.status !== 'UP' && parsed.status !== 'DOWN') {
      throw new Error("Invalid status received from AI.");
    }

    return {
      status: parsed.status === 'UP' ? CheckStatus.UP : CheckStatus.DOWN,
      statusCode: parsed.statusCode,
      reason: parsed.reason,
    };
  } catch (error) {
    console.error("Error checking website status:", error);
    let errorMessage = "Failed to get status from Gemini API.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};
