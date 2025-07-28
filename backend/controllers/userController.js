import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { logger } from "../utils/logger.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ---------------------- REGISTER ----------------------
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check required fields
    if (!name || !password || (!email && !phone)) {
      return res.json({
        success: false,
        message: "Name, password, and either email or phone are required.",
      });
    }

    // Email or phone format validation
    if (email && !validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format." });
    }
    if (phone && !validator.isMobilePhone(phone, "any")) {
      return res.json({ success: false, message: "Invalid phone number." });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    // Check if email or phone already exists
    const existingUser = await userModel.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists with this email or phone.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);

    res.json({
      success: true,
      token,
      name: user.name,
      coin: user.coin,
    });
  } catch (error) {
    logger.error("Registration Error:", { error: error.message, stack: error.stack });
    res.json({ success: false, message: error.message });
  }
};

// ---------------------- LOGIN ----------------------
const loginUser = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if (!password || (!email && !phone)) {
      return res.json({
        success: false,
        message: "Password and either email or phone are required.",
      });
    }

    const user = await userModel.findOne({
      $or: [{ email }, { phone }],
    });

    if (!user) {
      return res.json({ success: false, message: "User does not exist." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials." });
    }

    const token = createToken(user._id);
    res.json({
      success: true,
      token,
      name: user.name,
      coin: user.coin,
    });
  } catch (error) {
    logger.error("Login Error:", { error: error.message, stack: error.stack });
    res.json({ success: false, message: error.message });
  }
};

// ---------------------- ADMIN LOGIN ----------------------
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid admin credentials." });
    }
  } catch (error) {
    logger.error("Admin Login Error:", { error: error.message, stack: error.stack });
    res.json({ success: false, message: error.message });
  }
};

// ---------------------- GET USER INFO ----------------------
const getUserInfo = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }

    const { name, email, phone, coin, address } = user;
    res.json({ success: true, name, email, phone, coin, address });
  } catch (error) {
    logger.error("Get User Info Error:", { error: error.message, stack: error.stack });
    res.json({ success: false, message: error.message });
  }
};

// ---------------------- UPDATE PROFILE ----------------------
const updateProfile = async (req, res) => {
    try {
        const { userId } = req.body; // Comes from authUser middleware
        // Receive 'name' and 'address' from the frontend
        const { name, address } = req.body;

        const updateData = { name, address };

        const user = await userModel.findByIdAndUpdate(userId, updateData, { new: true });

        if (!user) {
            return res.json({ success: false, message: "User not found." });
        }

        res.json({ success: true, message: "Profile updated successfully." });

    } catch (error) {
        logger.error("Update Profile Error:", { error: error.message, stack: error.stack });
        res.json({ success: false, message: "Error updating profile." });
    }
};

export { registerUser, loginUser, adminLogin, getUserInfo, updateProfile };