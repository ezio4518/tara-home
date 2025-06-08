import { MongoClient } from "mongodb";
import "dotenv/config";

let client;

export const connectMongo = async () => {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log("✅ MongoDB connected");
  }
  return client;
};

export const getCollection = async () => {
  const db = mongoClient.db(process.env.MONGODB_DB);
  return db.collection(process.env.MONGODB_COLLECTION);
};