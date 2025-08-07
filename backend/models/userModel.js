import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true }, // Optional but unique
  phone: { type: String, unique: true, sparse: true }, // Optional but unique
  password: { type: String, required: true },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipcode: { type: String },
    country: { type: String }
  },
  coin: { type: Number, default: 50 },
  cartData: { type: Object, default: {} }
}, {
  minimize: false,
  timestamps: true // Adds createdAt and updatedAt
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;
