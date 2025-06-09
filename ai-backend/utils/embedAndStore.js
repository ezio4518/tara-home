import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { MongoClient } from "mongodb";
import { Document } from "langchain/document";
import "dotenv/config";
import fs from "fs/promises";
import { log } from "console";

// 1. Splitter
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 30,
});

// 2. Embedding model
const embeddings = new HuggingFaceTransformersEmbeddings({
  model: "Xenova/all-MiniLM-L6-v2",
});

// 3. Load product.json manually
const loadProductDocs = async (path) => {
  const raw = await fs.readFile(path, "utf8");
  const json = JSON.parse(raw);

  return json.map((item) => {
    const content = `
      Name: ${item.name}
      Description: ${item.description}
      Category: ${item.category} > Sub-Category: ${item.subCategory}
      Price: ₹${item.price}
      Bestseller: ${item.bestseller ? "Yes" : "No"}
    `;

    return new Document({
      pageContent: content,
      metadata: { source: "product", id: item._id },
    });
  });
};

// 4. Main embedding function
export const embedAndStoreAll = async () => {
  const faqDocs = await new TextLoader("./data/faq.txt").load();

  const productDocs = await loadProductDocs("./data/products.json");

  const allDocs = [...faqDocs, ...productDocs];

  const splitDocs = await splitter.splitDocuments(allDocs);

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const collection = client
    .db(process.env.MONGODB_DB)
    .collection(process.env.MONGODB_COLLECTION);

  await MongoDBAtlasVectorSearch.fromDocuments(splitDocs, embeddings, {
    collection,
    indexName: "default",
  });

  log("✅ All data embedded and stored in MongoDB Atlas");
};