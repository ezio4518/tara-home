// import mongoose from "mongoose";

// // Schema for each subCategory
// const subCategorySchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//       lowercase: true,
//     },
//   },
//   { _id: false }
// );

// // Schema for each company
// const companySchema = new mongoose.Schema(
//   {
//     companyName: {
//       type: String,
//       required: true,
//       trim: true,
//       lowercase: true,
//     },
//     subCategories: {
//       type: [subCategorySchema],
//       required: true,
//       validate: (arr) => Array.isArray(arr),
//     },
//   },
//   { _id: false }
// );

// // Main Category schema
// const categorySchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     trim: true,
//   },
//   companies: {
//     type: [companySchema],
//     required: true,
//     validate: (arr) => Array.isArray(arr),
//   },
// });

// const categoryModel =
//   mongoose.models.category || mongoose.model("category", categorySchema);
// export default categoryModel;

import mongoose from "mongoose";

const categoryNodeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, lowercase: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "category", default: null },
  path: [{ type: mongoose.Schema.Types.ObjectId, ref: "category" }],
  type: { type: String, trim: true, default: "category" }, // Optional
}, { timestamps: true });

const categoryModel = mongoose.models.category || mongoose.model("category", categoryNodeSchema);
export default categoryModel;