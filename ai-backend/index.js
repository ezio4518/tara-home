import express from "express";
import cors from "cors";
import "dotenv/config";
import chatRouter from "./routes/chatRoute.js";
// Import the new router
import knowledgeBaseRouter from "./routes/knowledgeBaseRoute.js"; 
import { connectMongo } from "./config/mongodb.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  console.log("Health check endpoint hit");
  res.status(200).json({
    status: 'healthy',
    message: 'AI-Backend API is alive and well!'
  });
});

// API Routes
app.use("/api", chatRouter);
// Use the new knowledge base router
app.use("/api", knowledgeBaseRouter); 

app.get("/", (req, res) => res.send("🧠 Gemini RAG API is Live"));

const startServer = async () => {
  try {
    await connectMongo();
    app.listen(PORT, () => {
      console.log(`🚀 AI Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    process.exit(1);
  }
};

startServer();