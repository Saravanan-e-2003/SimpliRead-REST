import { simplifyWithGemini } from "./providers/gemini.js";

//  central router
export async function simplifyText({ text, model }) {
  switch (model) {
    case "gemini":
      return await simplifyWithGemini(text);

    // future
    // case "mistral":
    //   return await simplifyWithMistral(text);

    default:
      throw new Error("Unsupported model");
  }
}