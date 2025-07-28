// import express from "express";
// import {
//   getAllCategories,
//   addOrUpdateCategory,
//   deleteSubCategory,
//   deleteCompany,
//   deleteCategory,
// } from "../controllers/categoryController.js";

// const categoryRouter = express.Router();

// // GET all categories 
// categoryRouter.get("/get", getAllCategories);

// // POST add or update a category 
// categoryRouter.post("/add", addOrUpdateCategory);

// // DELETE subcategory
// categoryRouter.post("/delete-subcat", deleteSubCategory);

// categoryRouter.post("/delete-com", deleteCompany);

// categoryRouter.post("/delete-cat", deleteCategory);

// export default categoryRouter;

import express from "express";
import {
  createCategory,
  getRootCategories,
  getCategoryChildren,
  getCategoryNode,
  deleteCategory,
  getAllCategoriesFlat
} from "../controllers/categoryController.js";

const categoryRouter = express.Router();

// Create a new category node (any level)
categoryRouter.post("/create", createCategory);

// Get all root categories (no parent)
categoryRouter.get("/roots", getRootCategories);

// Get children of a node
categoryRouter.get("/children/:parentId", getCategoryChildren);

// Get a single node by id
categoryRouter.get("/node/:id", getCategoryNode);

// Delete a node (and all descendants)
categoryRouter.delete("/delete/:id", deleteCategory);

// Get all categories (flat list for lookup)
categoryRouter.get("/all", getAllCategoriesFlat);

export default categoryRouter;