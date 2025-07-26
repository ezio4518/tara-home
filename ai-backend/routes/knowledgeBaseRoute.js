import express from "express";
import {
  addOrUpdateProduct,
  deleteProduct,
  updateFaq,
} from "../controllers/knowledgeBaseController.js";
import { verifyApiKey } from "../middleware/auth.js";

const router = express.Router();

// Apply the API Key verification middleware to all routes in this file
router.use(verifyApiKey);

/**
 * Route to add or update a product vector.
 * METHOD: POST
 * ENDPOINT: /api/product
 * BODY: The full product JSON object.
 */
router.post("/product", addOrUpdateProduct);

/**
 * Route to delete a product vector by its ID.
 * METHOD: DELETE
 * ENDPOINT: /api/product/:productId
 */
router.delete("/product/:productId", deleteProduct);

/**
 * Route to trigger a re-embedding of the FAQ file.
 * METHOD: POST
 * ENDPOINT: /api/faq
 */
router.post("/faq", updateFaq);

export default router;