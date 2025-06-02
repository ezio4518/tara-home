import express from "express";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { MongoClient } from "mongodb";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers"; // or OpenAIEmbeddings
import "dotenv/config";

const router = express.Router();

router.post("/", async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: "Missing question" });

  try {
    // 1. Connect to MongoDB Atlas
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    const collection = client
      .db(process.env.MONGODB_DB)
      .collection(process.env.MONGODB_COLLECTION);

    // 2. Set up Embeddings (can also use OpenAIEmbeddings here)
    const embeddings = new HuggingFaceTransformersEmbeddings({
      model: "Xenova/all-MiniLM-L6-v2",
    });

    // 3. Setup MongoDB Atlas Vector Store (NEW CONFIG)
    const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
      collection,
      indexName: "vector_index", // or your custom index name
      textKey: "text", // field name for content
      embeddingKey: "embedding", // field name for embeddings
    });

    // 4. Search top matches
    const results = await vectorStore.similaritySearch(question, 4);
    const context = results.map((doc) => doc.pageContent).join("\n\n");
    // 5. Gemini LLM via LangChain
    const llm = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      model: "gemini-1.5-flash",
      temperature: 0.3,
    });

    const prompt = `Answer this based on context only:\n\nContext:\n${context}\n\nQuestion: ${question}\n\nAnswer:`;

    const response = await llm.invoke(prompt);
    
    res.json({ answer: response.text });
  } catch (err) {
    console.error("❌ Gemini RAG error:", err.message);
    res.status(500).json({ error: "Gemini RAG failed", detail: err.message });
  }
});

export default router;
