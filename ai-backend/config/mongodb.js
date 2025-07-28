import { MongoClient } from "mongodb";
import "dotenv/config";
import { logger } from "../utils/logger.js";

let client;
let collection;

export const connectMongo = async () => {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    logger.info("✅ MongoDB connected");
    const db = client.db(process.env.MONGODB_DB);
    collection = db.collection(process.env.MONGODB_COLLECTION);
  }
};

export const getCollection = async () => {
  if (!collection) {
    throw new Error("❌ MongoDB not connected. Call connectMongo() first.");
  }
  return collection;
};