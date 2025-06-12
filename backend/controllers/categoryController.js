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

// ADD or UPDATE category → company → subcategory
export const addOrUpdateCategory = async (req, res) => {
  const { name, company, subCategory } = req.body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Category name is required.",
    });
  }

  try {
    const categoryName = name.toLowerCase().trim();
    const companyName = company?.toLowerCase().trim();
    const subCatName = subCategory?.toLowerCase().trim();

    let category = await categoryModel.findOne({ name: categoryName });

    if (!category) {
      // If category does not exist, create a new one
      const newCategory = {
        name: categoryName,
        companies: [],
      };

      // If company is provided, push it into companies
      if (companyName) {
        const newCompany = {
          companyName: companyName,
          subCategories: [],
        };

        // If subcategory is also provided
        if (subCatName) {
          newCompany.subCategories.push({ name: subCatName });
        }

        newCategory.companies.push(newCompany);
      }

      category = new categoryModel(newCategory);
    } else {
      // Category already exists
      if (companyName) {
        let companyObj = category.companies.find(
          (c) => c.companyName === companyName
        );

        if (!companyObj) {
          // If company not found, add it
          const newCompany = {
            companyName: companyName,
            subCategories: [],
          };

          if (subCatName) {
            newCompany.subCategories.push({ name: subCatName });
          }

          category.companies.push(newCompany);
        } else {
          // If company exists, check subCategory
          if (subCatName) {
            const exists = companyObj.subCategories.some(
              (sc) => sc.name === subCatName
            );
            if (!exists) {
              companyObj.subCategories.push({ name: subCatName });
            }
          }
        }
      }
    }

    await category.save();

    res.json({
      success: true,
      message: "Category updated",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE entire category
export const deleteCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Category name is required." });
  }

  try {
    const categoryName = name.toLowerCase().trim();
    const deleted = await categoryModel.findOneAndDelete({
      name: categoryName,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found." });
    }

    res.json({
      success: true,
      message: `Category '${categoryName}' deleted successfully.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE a company from a category
export const deleteCompany = async (req, res) => {
  const { name, company } = req.body;

  if (!name || !company) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Category and Company name are required.",
      });
  }

  try {
    const category = await categoryModel.findOne({
      name: name.toLowerCase().trim(),
    });
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found." });
    }

    category.companies = category.companies.filter(
      (c) => c.companyName !== company.toLowerCase().trim()
    );

    if (category.companies.length === 0) {
      await categoryModel.findByIdAndDelete(category._id); // delete category if empty
    } else {
      await category.save();
    }

    res.json({ success: true, message: "Company deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE a subcategory from a company
export const deleteSubCategory = async (req, res) => {
  const { name, company, subCategory } = req.body;

  if (!name || !company || !subCategory) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Category, Company, and SubCategory are required.",
      });
  }

  try {
    const category = await categoryModel.findOne({
      name: name.toLowerCase().trim(),
    });
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found." });
    }

    const companyObj = category.companies.find(
      (c) => c.companyName === company.toLowerCase().trim()
    );
    if (!companyObj) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found in category." });
    }

    companyObj.subCategories = companyObj.subCategories.filter(
      (sc) => sc.name !== subCategory.toLowerCase().trim()
    ); // Remove company if no subCategories left

    if (companyObj.subCategories.length === 0) {
      category.companies = category.companies.filter(
        (c) => c.companyName !== company.toLowerCase().trim()
      );
    } // Remove category if no companies left

    if (category.companies.length === 0) {
      await categoryModel.findByIdAndDelete(category._id);
    } else {
      await category.save();
    }

    res.json({ success: true, message: "SubCategory deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
