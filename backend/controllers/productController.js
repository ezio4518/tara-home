import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";
import csv from "csv-parser";
dotenv.config();

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
            // 👇 --- CHANGE HERE --- 👇
            unit, // <-- Add unit
            category, // Now this should be the full path or node name
            bestseller,
            image1,
            image2,
            image3,
            image4,
          } = row;

          // You must map "category" (e.g., "Gypsum/Channel/Angle") to a nodeId in the new system!
          if (!name?.trim() || !price?.trim() || !category?.trim()) {
            console.warn("⚠️ Skipping row due to missing required fields:", row);
            skippedRows++;
            continue;
          }

          // Try to find the category node by traversing the path (e.g. "Gypsum/Channel/Angle")
          const categoryPath = category.split("/").map(c => c.trim().toLowerCase());
          let parent = null, node = null;
          for (const nodeName of categoryPath) {
            node = await categoryModel.findOne({ name: nodeName, parent: parent });
            if (!node) {
              // Create node if not found
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
            console.warn("⚠️ Could not find or create category node for:", row.category);
            skippedRows++;
            continue;
          }

          // Images
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
            console.warn(`⚠️ Skipping row — no image uploaded:`, name || row);
            skippedRows++;
            continue;
          }

          // Save product
          const product = new productModel({
            name,
            description,
            price: Number(price),
             // 👇 --- CHANGE HERE --- 👇
            unit: unit || 'piece', // <-- Add unit, with fallback
            category: node._id,
            bestseller: bestseller?.toLowerCase() === "true",
            image: uploadedImages,
            date: Date.now(),
          });
          await product.save();
          uploadedCount++;
          console.log(`Upload ${uploadedCount} completed : ${name}`);
        }
        // Cleanup
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
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      // 👇 --- CHANGE HERE --- 👇
      unit, // <-- Add unit
      category, // expects node id from frontend
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
      // 👇 --- CHANGE HERE --- 👇
      unit, // <-- Add unit
      bestseller: bestseller === "true" || bestseller === true,
      image: imagesUrl,
      date: Date.now(),
    };
    const product = new productModel(productData);
    await product.save();

    // Notify AI backend (optional, keep/remove as you need)
    try {
      await axios.post(process.env.AI_BACKEND_URL + "/api/update-product", {
        name: product.name,
        description: product.description,
        price: product.price,
        unit: product.unit,
        category: product.category,
        bestseller: product.bestseller,
        date: product.date,
        createdAt: product.createdAt,
      });
    } catch (err) {
      console.error("AI backend notification failed:", err.message);
    }

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// List products
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({}).populate("category");
    res.json({ success: true, products });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Remove product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId).populate("category");
    res.json({ success: true, product });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const {
      productId,
      name,
      description,
      price,
      // 👇 --- CHANGE HERE --- 👇
      unit, // <-- Add unit
      category,
      bestseller,
    } = req.body;
    const updateData = {
      name,
      description,
      price: Number(price),
      // 👇 --- CHANGE HERE --- 👇
      unit, // <-- Add unit
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
    await productModel.findByIdAndUpdate(productId, updateData, { new: true });
    res.json({ success: true, message: "Product updated successfully" });
  } catch (error) {
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