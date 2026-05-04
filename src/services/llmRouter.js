import { simplifyWithGemini } from "./providers/gemini.js";
import { simplifyWithMistral } from "./providers/mistral.js"; // future

//  central router
export async function simplifyText({ text, model }) {
  switch (model) {
    case "gemini":
      return await simplifyWithGemini(text);
      break;
    
    case "mistral":
      return await simplifyWithMistral(text);
      break;

    // future
    // case "mistral":
    //   return await simplifyWithMistral(text);

    default:
      throw new Error("Unsupported model");
  }
}