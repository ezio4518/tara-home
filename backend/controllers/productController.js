import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import productModel from "../models/productModel.js";
import dotenv from "dotenv";
dotenv.config();

// function for add product
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, bestseller } =
      req.body;
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
      price: Number(price),
      subCategory,
      bestseller: bestseller === "true" ? true : false,
      image: imagesUrl,
      date: Date.now(),
    };

    console.log(productData);
    const product = new productModel(productData);
    await product.save();

    // Notify AI backend
    try {
      await axios.post(process.env.AI_BACKEND_URL + "/update-product", {
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
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
      subCategory,
      bestseller,
    } = req.body;

    const updateData = {
      name,
      description,
      price: Number(price),
      category,
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
};
