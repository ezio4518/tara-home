import express from "express";
import { handleChat } from "../controllers/chatController.js";

const chatRouter = express.Router();
chatRouter.post("/chat", handleChat);
export default chatRouter;