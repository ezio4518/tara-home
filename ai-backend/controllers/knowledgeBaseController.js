import {
  embedProduct,
  deleteVectorsByFilter,
  reEmbedFaq,
} from "../services/vectorStoreService.js";
import { logger } from "../utils/logger.js";

/**
 * Handles adding or updating a product's vector embedding.
 * It first deletes any existing vectors for the product ID to prevent duplicates,
 * then embeds the new or updated data.
 */
export const addOrUpdateProduct = async (req, res) => {
  const productData = req.body;
  // Ensure the product data includes an ID for targeting
  if (!productData._id) {
    return res.status(400).json({ success: false, error: "Product ID (_id) is required." });
  }

  try {
    // Define a filter to find the specific product's existing vectors
    const filter = { "metadata.source": "product", "metadata.productId": productData._id.toString() };
    
    // First, delete any existing vectors for this product
    await deleteVectorsByFilter(filter);
    
    // Then, embed the new or updated product information
    await embedProduct(productData);
    
    res.json({ success: true, message: `Product ${productData._id} was successfully updated in the knowledge base.` });
  } catch (err) {
    logger.error(`❌ Error embedding product ${productData._id}:`, { error: err.message, stack: err.stack });
    res.status(500).json({ success: false, error: "Failed to update product vector." });
  }
};

/**
 * Handles deleting a product's vector from the knowledge base using its ID.
 */
export const deleteProduct = async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    return res.status(400).json({ success: false, error: "A Product ID parameter is required." });
  }
  
  try {
    const filter = { "metadata.source": "product", "metadata.productId": productId };
    await deleteVectorsByFilter(filter);
    res.json({ success: true, message: `Product ${productId} vectors have been deleted from the knowledge base.` });
  } catch (err) {
    logger.error(`❌ Error deleting product ${productId} vectors:`, { error: err.message, stack: err.stack });
    res.status(500).json({ success: false, error: "Failed to delete product vectors." });
  }
};

/**
 * Triggers a complete refresh of the FAQ information in the vector store.
 */
export const updateFaq = async (req, res) => {
  try {
    await reEmbedFaq();
    res.json({ success: true, message: "FAQ has been successfully updated in the knowledge base." });
  } catch (err) {
    logger.error("❌ Error updating FAQ:", { error: err.message, stack: err.stack });
    res.status(500).json({ success: false, error: "Failed to update FAQ." });
  }
};