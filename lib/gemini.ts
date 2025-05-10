import { isSimpleGreeting, getGreetingResponse } from "./prompts"
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Updated model names to match the current Gemini API (v1beta)
export type GeminiModel = "gemini-1.5-pro" | "gemini-1.5-flash";

export interface GeminiOptions {
  model: GeminiModel
  prompt: string
  thinking?: boolean // This might be deprecated if the model handles "thinking" internally
  translate?: boolean // This might be deprecated if translation is a specific prompt/model feature
}

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not set in environment variables.");
}
const genAI = new GoogleGenerativeAI(apiKey);

export async function generateGeminiResponse(options: GeminiOptions): Promise<string> {
  // Check if the prompt is a simple greeting
  if (isSimpleGreeting(options.prompt)) {
    return getGreetingResponse(options.prompt);
  }

  console.log(`Generating response with model: ${options.model}`);
  // console.log(`Thinking mode: ${options.thinking ? "enabled" : "disabled"}`); // Potentially deprecated
  // console.log(`Translate mode: ${options.translate ? "enabled" : "disabled"}`); // Potentially deprecated

  try {
    const model = genAI.getGenerativeModel({
      model: options.model,
      // Generation config can be added here if needed, e.g., temperature, topK, topP
      // safetySettings can be adjusted if needed, for example:
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    // For simplicity, directly using the prompt.
    // For more complex scenarios (like chat history, or specific instructions for thinking/translation),
    // the prompt might need to be structured differently or use different SDK methods (e.g., startChat).

    // The 'thinking' and 'translate' flags are not directly used by the SDK's generateContent method
    // in the way the placeholder simulated. If these are important features,
    // they would typically be handled by:
    // 1. Prompt engineering: Crafting the prompt to ask the model to "think step by step" or "translate the following".
    // 2. Using specific model capabilities if available for these tasks.

    // Example of a simple text generation:
    const result = await model.generateContent(options.prompt);
    const response = result.response;
    const text = response.text();
    return text;

  } catch (error) {
    console.error("Error generating response from Gemini API:", error);
    if (error instanceof Error && error.message.includes("API key not valid")) {
      return "Error: The Gemini API key is not valid. Please check your .env.local file.";
    }
    if (error instanceof Error && error.message.includes("quota")) {
        return "Error: You have exceeded your Gemini API quota. Please check your Google Cloud console.";
    }
    return "Sorry, I encountered an error while trying to generate a response. Please try again later.";
  }
}
