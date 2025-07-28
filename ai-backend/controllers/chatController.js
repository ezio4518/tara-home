import { findRelevantDocuments } from "../services/vectorStoreService.js";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { logger } from "../utils/logger.js";

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-2.5-flash",
  temperature: 0.3,
});

export const handleChat = async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ success: false, error: "Question is required." });
  }

  try {
    const context = await findRelevantDocuments(question);

    // --- START: Updated Prompt ---
    const prompt = `You are "Tara", an expert AI assistant for "Maa Tara Home". Your goal is to provide accurate and efficient answers based ONLY on the provided "Context".

    **Instructions:**
    1.  **Analyze the "Customer Question"** to understand the core information they are asking for.
    2.  **Strictly use the "Context"** to find the answer. Do not use any outside knowledge.
    3.  **If the answer is in the context:**
        - **Answer Directly First:** Get straight to the point and provide the specific information the user asked for.
        - **Add Brief Context After:** After giving the direct answer, you can add a short, helpful sentence of context if necessary. For example, if they ask for a phone number, give the number first, then mention what it's used for.
        - **Keep it Concise:** Avoid unnecessary greetings or conversational filler in your replies.
    4.  **If the answer is NOT in the context:**
        - DO NOT make up an answer.
        - Respond with: "I'm sorry, I don't have that specific information. Could you please rephrase, or ask about our products, store policies, or delivery details?"
    5.  **For greetings** (e.g., "hello"): Briefly respond and ask how you can help, like: "Hello! How can I assist you today?"

    **Context From Knowledge Base:**
    ---
    ${context || "No context found."}
    ---

    **Customer Question:** ${question}

    **Your Answer:**
    `;
    // --- END: Updated Prompt ---

    const response = await llm.invoke(prompt);

    res.json({ success: true, answer: response.content });
  } catch (err) {
    logger.error("❌ Chat Controller Error:", { error: err.message, stack: err.stack });
    res.status(500).json({ success: false, error: "An error occurred while processing your request." });
  }
};