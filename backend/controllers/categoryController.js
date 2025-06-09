import categoryModel from "../models/categoryModel.js";

// GET all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST add or update category and subcategory
export const addOrUpdateCategory = async (req, res) => {
  const { name, subCategory } = req.body;

  if (!name || !subCategory) {
    return res.status(400).json({
      success: false,
      message: "Category and SubCategory are required.",
    });
  }

  try {
    const categoryName = name.toLowerCase().trim();
    const subCat = subCategory.toLowerCase().trim();

    let category = await categoryModel.findOne({ name: categoryName });

    if (category) {
      // Update existing category
      if (!category.subCategories.includes(subCat)) {
        category.subCategories.push(subCat);
        await category.save();
      }
    } else {
      // Create new category
      category = new categoryModel({
        name: categoryName,
        subCategories: [subCat],
      });
      await category.save();
    }

    res.json({ success: true, message: "Category saved", data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// OPTIONAL: Delete a subcategory from a category
export const deleteSubCategory = async (req, res) => {
  const { name, subCategory } = req.body;

  try {
    const category = await categoryModel.findOne({
      name: name.toLowerCase().trim(),
    });
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });

    category.subCategories = category.subCategories.filter(
      (sub) => sub !== subCategory.toLowerCase().trim()
    );

    if (category.subCategories.length === 0) {
      await categoryModel.findByIdAndDelete(category._id); // remove whole category if empty
    } else {
      await category.save();
    }

    res.json({ success: true, message: "Subcategory deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE entire category
export const deleteCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Category name is required.",
    });
  }

  try {
    const categoryName = name.toLowerCase().trim();
    const deleted = await categoryModel.findOneAndDelete({ name: categoryName });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    res.json({
      success: true,
      message: `Category '${categoryName}' deleted successfully.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};