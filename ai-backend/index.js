import express from "express";
import cors from "cors";
import "dotenv/config";
import chatRouter from "./routes/chatRoute.js";
import { connectMongo } from "./config/mongodb.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use("/api/chat", chatRouter);
app.get("/", (req, res) => res.send("🧠 Gemini RAG API is Live"));

const startServer = async () => {
  try {
    await connectMongo();
    app.listen(PORT, () => {
      console.log(`🚀 AI Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect MongoDB:", err.message);
    process.exit(1);
  }
};

startServer();