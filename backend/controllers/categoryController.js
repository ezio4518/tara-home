import categoryModel from "../models/categoryModel.js";
import { logger } from "../utils/logger.js";

// CREATE a new category node (can be any level)
export const createCategory = async (req, res) => {
  try {
    const { name, parentId, type } = req.body;
    let path = [];
    if (parentId) {
      const parent = await categoryModel.findById(parentId);
      if (!parent) return res.status(400).json({ success: false, message: "Parent not found" });
      path = [...parent.path, parent._id];
    }
    const node = new categoryModel({ name, parent: parentId || null, path, type });
    await node.save();
    res.status(201).json({ success: true, data: node });
  } catch (e) {
    logger.error('Error creating category', { error: e.message, stack: e.stack });
    res.status(500).json({ success: false, message: e.message });
  }
};

// GET all root categories (parent: null)
export const getRootCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find({ parent: null }).sort("name");
    res.json({ success: true, data: categories });
  } catch (error) {
    logger.error('Error fetching root categories', { error: error.message, stack: error.stack });
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET children of a category node
export const getCategoryChildren = async (req, res) => {
  try {
    const { parentId } = req.params;
    const children = await categoryModel.find({ parent: parentId }).sort("name");
    res.json({ success: true, data: children });
  } catch (error) {
    logger.error('Error fetching category children', { error: error.message, stack: error.stack, parentId });
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET a single category node by id
export const getCategoryNode = async (req, res) => {
  try {
    const { id } = req.params;
    const node = await categoryModel.findById(id);
    res.json({ success: true, data: node });
  } catch (error) {
    logger.error('Error fetching category node', { error: error.message, stack: error.stack, id });
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE a category node and all its descendants
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const idsToDelete = [id];
    // Recursively find all descendants
    async function findDescendants(nodeId) {
      const children = await categoryModel.find({ parent: nodeId });
      for (const child of children) {
        idsToDelete.push(child._id.toString());
        await findDescendants(child._id);
      }
    }
    await findDescendants(id);
    await categoryModel.deleteMany({ _id: { $in: idsToDelete } });
    res.json({ success: true, deleted: idsToDelete });
  } catch (error) {
    logger.error('Error deleting category', { error: error.message, stack: error.stack, id });
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET all categories (flat, for lookup)
export const getAllCategoriesFlat = async (req, res) => {
  try {
    const all = await categoryModel.find({});
    res.json({ success: true, data: all });
  } catch (error) {
    logger.error('Error fetching all categories (flat)', { error: error.message, stack: error.stack });
    res.status(500).json({ success: false, message: error.message });
  }
};