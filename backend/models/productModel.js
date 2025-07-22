import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  unit: { type: String, required: true, default: 'piece' }, // e.g., 'piece', 'sq m', 'kg', 'set'
  image: { type: Array, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "category", required: true },
  bestseller: { type: Boolean },
  date: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});
const productModel = mongoose.models.product || mongoose.model("product", productSchema);
export default productModel;