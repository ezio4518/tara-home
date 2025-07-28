import express from "express";
import cors from "cors";
import "dotenv/config";
import morgan from "morgan";
import { logger, morganStream } from "./utils/logger.js";
import chatRouter from "./routes/chatRoute.js";
// Import the new router
import knowledgeBaseRouter from "./routes/knowledgeBaseRoute.js"; 
import { connectMongo } from "./config/mongodb.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Use morgan for HTTP request logging and pipe it to Winston
app.use(morgan('dev', { stream: morganStream }));

app.get('/health', (req, res) => {
  logger.info("Health check endpoint hit");
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
      logger.info(`🚀 AI Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.error("❌ Failed to connect to MongoDB:", { error: err.message, stack: err.stack });
    process.exit(1);
  }
};

startServer();