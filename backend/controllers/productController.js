import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";
import csv from "csv-parser";
import { logger } from "../utils/logger.js";
dotenv.config();


// --- START: AI Backend Integration ---
// Create a dedicated axios instance for secure communication with the AI backend.
const aiApiClient = axios.create({
  baseURL: process.env.AI_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': process.env.API_SECRET_KEY // Your secret key for the AI backend
  }
});
// --- END: AI Backend Integration ---

// Bulk upload products from CSV and ZIP
const bulkUploadProducts = async (req, res) => {
  try {
    const csvFile = req.files?.csv?.[0];
    const zipFile = req.files?.zip?.[0];
    if (!csvFile || !zipFile) {
      return res.status(400).json({
        success: false,
        message: "Both CSV and ZIP are required.",
      });
    }
    const zip = new AdmZip(zipFile.path);
    const tempFolder = "./temp_uploads";
    zip.extractAllTo(tempFolder, true);

    const results = [];
    let skippedRows = 0;
    let uploadedCount = 0;

    fs.createReadStream(csvFile.path)
      .pipe(csv())
      .on("data", (row) => {
        const cleanedRow = {};
        for (const key in row) {
          const cleanKey = key.trim();
          const cleanValue = row[key]?.toString().trim();
          cleanedRow[cleanKey] = cleanValue;
        }
        const hasData = Object.values(cleanedRow).some((val) => val !== "");
        if (hasData) results.push(cleanedRow);
      })
      .on("end", async () => {
        for (const row of results) {
          const {
            name,
            description,
            price,
            unit,
            category,
            bestseller,
            image1,
            image2,
            image3,
            image4,
          } = row;

          if (!name?.trim() || !price?.trim() || !category?.trim()) {
            logger.warn("⚠️ Skipping row due to missing required fields:", { row });
            skippedRows++;
            continue;
          }
          const categoryPath = category.split("/").map(c => c.trim().toLowerCase());
          let parent = null, node = null;
          for (const nodeName of categoryPath) {
            node = await categoryModel.findOne({ name: nodeName, parent: parent });
            if (!node) {
              node = new categoryModel({
                name: nodeName,
                parent: parent,
                path: parent
                  ? [...(await categoryModel.findById(parent)).path, parent]
                  : [],
                type: "category",
              });
              await node.save();
            }
            parent = node._id;
          }
          if (!node) {
            logger.warn("⚠️ Could not find or create category node for:", { category: row.category });
            skippedRows++;
            continue;
          }
          const imageFiles = [image1, image2, image3, image4]
            .filter(Boolean)
            .map((img) => img.trim());
          const uploadedImages = [];
          for (let img of imageFiles) {
            const filePath = path.join(tempFolder, img);
            if (fs.existsSync(filePath)) {
              const cloud = await cloudinary.uploader.upload(filePath, {
                resource_type: "image",
              });
              uploadedImages.push(cloud.secure_url);
            }
          }
          if (uploadedImages.length === 0) {
            logger.warn(`⚠️ Skipping row — no image uploaded:`, { name });
            skippedRows++;
            continue;
          }
          const product = new productModel({
            name,
            description,
            price: Number(price),
            unit: unit || 'piece',
            category: node._id,
            bestseller: bestseller?.toLowerCase() === "true",
            image: uploadedImages,
            date: Date.now(),
          });
          await product.save();

          // --- START: AI Notification ---
          try {
            await aiApiClient.post("/api/product", product.toObject());
            logger.info(`✅ AI Notification sent for added product: ${product.name}`);
          } catch (err) {
            logger.error("❌ AI backend notification failed for added product:", { error: err.message });
          }
          // --- END: AI Notification ---

          uploadedCount++;
          logger.info(`Upload ${uploadedCount} completed : ${name}`);
        }
        fs.unlinkSync(csvFile.path);
        fs.unlinkSync(zipFile.path);
        fs.rmSync(tempFolder, { recursive: true, force: true });
        return res.json({
          success: true,
          message: "Bulk upload completed.",
          uploaded: uploadedCount,
          skipped: skippedRows,
        });
      });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      unit,
      category,
      bestseller,
    } = req.body;
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];
    const images = [image1, image2, image3, image4].filter((item) => item !== undefined);
    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );
    const productData = {
      name,
      description,
      category,
      price: Number(price),
      unit: unit || 'piece',
      bestseller: bestseller === "true" || bestseller === true,
      image: imagesUrl,
      date: Date.now(),
    };
    const product = new productModel(productData);
    await product.save();

    // --- START: AI Notification ---
    try {
      // Use the toObject() method to get a plain JS object for sending
      await aiApiClient.post("/api/product", product.toObject());
      logger.info(`✅ AI Notification sent for added product: ${product.name}`);
    } catch (err) {
      logger.error("❌ AI backend notification failed for added product:", { error: err.message });
    }
    // --- END: AI Notification ---

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    logger.error(error);
    res.json({ success: false, message: error.message });
  }
};

const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({}).populate("category");
    res.json({ success: true, products });
  } catch (error) {
    logger.error(error);
    res.json({ success: false, message: error.message });
  }
};

const removeProduct = async (req, res) => {
  try {
    const productId = req.body.id;
    const deletedProduct = await productModel.findByIdAndDelete(productId);

    if (!deletedProduct) {
        return res.json({ success: false, message: "Product not found." });
    }

    // --- START: AI Notification ---
    try {
        await aiApiClient.delete(`/api/product/${productId}`);
        logger.info(`✅ AI Notification sent for deleted product: ${productId}`);
    } catch (err) {
        logger.error("❌ AI backend notification failed for deleted product:", { error: err.message });
    }
    // --- END: AI Notification ---

    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    logger.error(error);
    res.json({ success: false, message: error.message });
  }
};

const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId).populate("category");
    res.json({ success: true, product });
  } catch (error) {
    logger.error(error);
    res.json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const {
      productId,
      name,
      description,
      price,
      unit,
      category,
      bestseller,
    } = req.body;
    const updateData = {
      name,
      description,
      price: Number(price),
      unit: unit || 'piece',
      category,
      bestseller: bestseller === "true" || bestseller === true,
    };
    if (req.files && Object.keys(req.files).length > 0) {
      const imageFields = [
        req.files.image1,
        req.files.image2,
        req.files.image3,
        req.files.image4,
      ];
      const images = imageFields.map((f) => f?.[0]).filter(Boolean);
      const imagesUrl = await Promise.all(
        images.map(async (item) => {
          const result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
          });
          return result.secure_url;
        })
      );
      updateData.image = imagesUrl;
    }
    const updatedProduct = await productModel.findByIdAndUpdate(productId, updateData, { new: true });

    // --- START: AI Notification ---
    if (updatedProduct) {
        try {
            await aiApiClient.post("/api/product", updatedProduct.toObject());
            logger.info(`✅ AI Notification sent for updated product: ${updatedProduct.name}`);
        } catch (err) {
            logger.error("❌ AI backend notification failed for updated product:", { error: err.message });
        }
    }
    // --- END: AI Notification ---

    res.json({ success: true, message: "Product updated successfully" });
  } catch (error) {
    logger.error(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  listProducts,
  addProduct,
  removeProduct,
  singleProduct,
  updateProduct,
  bulkUploadProducts,
};