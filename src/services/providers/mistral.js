import { OpenRouter } from "@openrouter/sdk";

const client = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function simplifyWithMistral(text) {
  const completion = await client.chat.send({
    model: "openai/gpt-5.2", // you can switch dynamically later
    messages: [
      {
        role: "user",
        content: text,
      },
    ],
  });

  return completion.choices[0].message.content.trim();
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