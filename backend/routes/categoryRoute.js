import express from "express";
import {
  getAllCategories,
  addOrUpdateCategory,
  deleteSubCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const categoryRouter = express.Router();

// GET all categories 
categoryRouter.get("/get", getAllCategories);

// POST add or update a category 
categoryRouter.post("/add", addOrUpdateCategory);

// DELETE subcategory
categoryRouter.post("/delete-subcat", deleteSubCategory);

categoryRouter.post("/delete-cat", deleteCategory);

export default categoryRouter;
