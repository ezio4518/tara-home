import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
import { Document } from "langchain/document";
import { getCollection } from "../config/mongodb.js";

export const updateProductVector = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      bestseller,
      date,
      createdAt,
    } = req.body;

    const content = `
      Name: ${name}
      Description: ${description}
      Category: ${category} > Sub-Category: ${subCategory}
      Price: ₹${price}
      Bestseller: ${bestseller ? "Yes" : "No"}
    `;

    const doc = new Document({
      pageContent: content,
      metadata: { source: "product", createdAt },
    });
    console.log("✅ Document created for product embedding:", doc.pageContent);

    const collection = await getCollection();
    const embeddings = new HuggingFaceTransformersEmbeddings({
      model: "Xenova/all-MiniLM-L6-v2",
    });
    console.log("✅ Using embeddings model:", embeddings.model);

    const vectorStore = await MongoDBAtlasVectorSearch.fromDocuments(
      [doc],
      embeddings,
      {
        collection,
        indexName: "vector_index",
      }
    );
    console.log("✅ Vector store updated with new product embedding");
    res.json({ success: true, message: "Product embedded successfully" });
  } catch (err) {
    console.error("❌ Vector embedding error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};