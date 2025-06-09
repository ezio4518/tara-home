import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  subCategories: {
    type: [String],
    required: true,
    validate: (arr) => Array.isArray(arr) && arr.length > 0,
  },
});

const categoryModel =
  mongoose.models.category || mongoose.model("category", categorySchema);
export default categoryModel;
