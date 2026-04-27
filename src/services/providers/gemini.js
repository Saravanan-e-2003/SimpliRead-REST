import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY});

export async function simplifyWithGemini(text) {
    const prompt = buildPrompt(text);

    const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
    });
    const response = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    return response.trim();
}

function buildPrompt(text) {
  return `
You are a text simplification engine.

RULES:
- No new info
- No summarizing
- Keep meaning exact
- Simplify wording only
- No explanation

TEXT: 
${text}
`;
}