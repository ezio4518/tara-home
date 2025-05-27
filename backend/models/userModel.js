import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    coin: { type: Number, default: 50 },
    cartData: { type: Object, default: {} }
}, { 
    minimize: false,
    timestamps: true // adds createdAt and updatedAt automatically
});


const userModel = mongoose.models.user || mongoose.model('user',userSchema);

export default userModel