import mongoose from "mongoose";

// Schema for each subCategory
const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
  },
  { _id: false }
);

// Schema for each company
const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    subCategories: {
      type: [subCategorySchema],
      required: true,
      validate: (arr) => Array.isArray(arr),
    },
  },
  { _id: false }
);

// Main Category schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  companies: {
    type: [companySchema],
    required: true,
    validate: (arr) => Array.isArray(arr),
  },
});

const categoryModel =
  mongoose.models.category || mongoose.model("category", categorySchema);
export default categoryModel;
