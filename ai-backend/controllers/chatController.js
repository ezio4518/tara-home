import { getCollection } from "../config/mongodb.js";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const handleChat = async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: "Missing question" });

  try {
    const collection = await getCollection();

    const embeddings = new HuggingFaceTransformersEmbeddings({
      model: "Xenova/all-MiniLM-L6-v2",
    });

    const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
      collection,
      indexName: "vector_index",
      textKey: "text",
      embeddingKey: "embedding",
    });

    const results = await vectorStore.similaritySearch(question, 4);
    const context = results.map((doc) => doc.pageContent).join("\n\n");

    const llm = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      model: "gemini-2.0-flash",
      temperature: 0.2,
    });

    const prompt = `
You are a helpful and polite virtual assistant for an e-commerce website. 
Your primary role is to:
- Answer product-related questions using the provided context.
- If the user asks general questions like "hello", "who are you", "help", or any non-product query, respond politely and guide the user to ask about products, orders, or support.
- If unsure, ask the customer to rephrase or provide more detail.

Context:
${context}

Customer Question: ${question}

Answer:
`;

    const response = await llm.invoke(prompt);
    console.log("✅ Gemini RAG response:", response.text);
    res.json({ answer: response.text });
  } catch (err) {
    console.error("❌ Gemini RAG error:", err.message);
    res.status(500).json({ error: "Gemini RAG failed", detail: err.message });
  }
};
