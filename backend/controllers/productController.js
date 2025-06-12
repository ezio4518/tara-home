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
            category,
            company,
            subCategory,
            bestseller,
            image1,
            image2,
            image3,
            image4,
          } = row;

          const cat = category?.trim();
          const com = company?.trim();
          const sub = subCategory?.trim();

          // ✅ Required field checks
          if (!name?.trim() || !price?.trim() || !cat?.trim()) {
            console.warn("⚠️ Skipping row due to missing required fields:", row);
            skippedRows++;
            continue;
          }

          // ✅ Ensure category (and optionally company + subCategory)
          let catDoc = await categoryModel.findOne({ name: cat });
          if (!catDoc) {
            const newCompany = com
              ? {
                  companyName: com,
                  subCategories: sub ? [{ name: sub }] : [],
                }
              : undefined;
            catDoc = await categoryModel.create({
              name: cat,
              companies: newCompany ? [newCompany] : [],
            });
          } else if (com) {
            let updated = false;
            const companyIndex = catDoc.companies.findIndex(
              (c) => c.companyName.toLowerCase() === com.toLowerCase()
            );

            if (companyIndex === -1) {
              catDoc.companies.push({
                companyName: com,
                subCategories: sub ? [{ name: sub }] : [],
              });
              updated = true;
            } else if (sub) {
              const subExists = catDoc.companies[companyIndex].subCategories.some(
                (sc) => sc.name.toLowerCase() === sub.toLowerCase()
              );
              if (!subExists) {
                catDoc.companies[companyIndex].subCategories.push({ name: sub });
                updated = true;
              }
            }

            if (updated) {
              await catDoc.save();
            }
          }

          // ✅ Upload images from ZIP
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

          // ✅ Save product
          const product = new productModel({
            name,
            description,
            price: Number(price),
            category: cat,
            company: com || "N/A",
            subCategory: sub || "N/A",
            bestseller: bestseller?.toLowerCase() === "true",
            image: uploadedImages,
            date: Date.now(),
          });

          await product.save();
          uploadedCount++;
          console.log(`Upload ${uploadedCount} completed : ${name}`);
        }

        // ✅ Cleanup
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

// function for add product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      company,
      subCategory,
      bestseller,
    } = req.body;
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];
    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );
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
      company: company || "N/A", // ✅ fallback to empty
      subCategory: subCategory || "N/A", // ✅ fallback to empty
      price: Number(price),
      bestseller: bestseller === "true" ? true : false,
      image: imagesUrl,
      date: Date.now(),
    };

    console.log(productData);
    const product = new productModel(productData);
    await product.save();

    // Notify AI backend
    try {
      await axios.post(process.env.AI_BACKEND_URL + "/api/update-product", {
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        company: product.company,
        subCategory: product.subCategory,
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

// function for list product
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for removing product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for editing product
const updateProduct = async (req, res) => {
  try {
    const {
      productId,
      name,
      description,
      price,
      category,
      company,
      subCategory,
      bestseller,
    } = req.body;

    const updateData = {
      name,
      description,
      price: Number(price),
      category,
      company,
      subCategory,
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
    console.error(error);
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
