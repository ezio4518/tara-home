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
    console.log("✅ Using embeddings model:", embeddings.model);

    const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
      collection,
      indexName: "vector_index",
      textKey: "text",
      embeddingKey: "embedding",
    });
    console.log("✅ Connected to MongoDB Atlas Vector Search");

    const results = await vectorStore.similaritySearch(question, 4);
    const context = results.map((doc) => doc.pageContent).join("\n\n");
    console.log("✅ Retrieved context from vector store");

    const llm = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      model: "gemini-2.0-flash",
      temperature: 0.3,
    });
    console.log("✅ Initialized Gemini LLM with model:", llm.model);

    const prompt = `Answer this based on context only:\n\nContext:\n${context}\n\nQuestion: ${question}\n\nAnswer:`;
    const response = await llm.invoke(prompt);

    res.json({ answer: response.text });
  } catch (err) {
    console.error("❌ Gemini RAG error:", err.message);
    res.status(500).json({ error: "Gemini RAG failed", detail: err.message });
  }
};