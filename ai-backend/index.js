import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config";
import chatRouter from "./routes/chat.js";
import { embedAndStoreAll } from "./utils/embedAndStore.js";

// Optional: Run once to embed and store
// await embedAndStoreAll();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/chat", chatRouter);

app.get("/", (req, res) => res.send("🧠 Gemini RAG API is Live"));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});