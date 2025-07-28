import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
import { Document } from "langchain/document";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { getCollection } from "../config/mongodb.js";
import fs from "fs/promises";
import { logger } from "../utils/logger.js";

// Initialize models and splitters once to be efficient
const embeddings = new HuggingFaceTransformersEmbeddings({
  model: "Xenova/all-MiniLM-L6-v2",
});

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 50,
});

/**
 * Creates and returns an instance of the vector store.
 */
const getVectorStore = async () => {
  const collection = await getCollection();
  return new MongoDBAtlasVectorSearch(embeddings, {
    collection,
    indexName: "vector_index", // Ensure this matches your Atlas Search index name
  });
};

/**
 * Deletes vectors from the collection based on a metadata filter.
 * @param {object} filter - The MongoDB filter to use for deletion.
 */
export const deleteVectorsByFilter = async (filter) => {
  const collection = await getCollection();
  const result = await collection.deleteMany(filter);
  logger.info(`✅ Deleted ${result.deletedCount} vector(s) matching filter:`, { filter });
  return result;
};

/**
 * Creates a structured document for a product and stores its embedding.
 * @param {object} productData - The product data.
 */
export const embedProduct = async (productData) => {
  const { _id, name, description, price, category, subCategory, bestseller } = productData;

  const content = `Product Name: ${name}\nDescription: ${description}\nCategory: ${category} > ${subCategory}\nPrice: ₹${price}\nBestseller: ${bestseller ? "Yes" : "No"}`;

  const doc = new Document({
    pageContent: content,
    // Add a unique productId to the metadata for precise updates/deletions
    metadata: { source: 'product', productId: _id.toString() },
  });

  const vectorStore = await getVectorStore();
  await vectorStore.addDocuments([doc]);
  logger.info(`✅ Embedded product with ID: ${_id}`);
};

/**
 * Re-embeds the entire FAQ file, deleting old entries first to ensure freshness.
 */
export const reEmbedFaq = async () => {
  // 1. Delete all old FAQ vectors to prevent outdated information
  await deleteVectorsByFilter({ "metadata.source": "faq.txt" });

  // 2. Load, split, and embed the new FAQ content
  const loader = new TextLoader("./data/faq.txt");
  const docs = await loader.load();
  const splitDocs = await splitter.splitDocuments(docs);

  const vectorStore = await getVectorStore();
  await vectorStore.addDocuments(splitDocs);
  logger.info(`✅ Re-embedded ${splitDocs.length} chunks from faq.txt`);
};

/**
 * Performs a similarity search to find context relevant to a user's question.
 * @param {string} question - The user's question.
 * @returns {string} - The combined page content of relevant documents.
 */
export const findRelevantDocuments = async (question) => {
    const vectorStore = await getVectorStore();
    // Retrieve 4 most relevant documents
    const results = await vectorStore.similaritySearch(question, 4);
    // Join the content with a separator for the LLM prompt
    return results.map((doc) => doc.pageContent).join("\n\n---\n\n");
};