import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

// Total Orders
const getTotalOrders = async (req, res) => {
  try {
    const totalOrders = await orderModel.countDocuments();
    res.json({ totalOrders });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching total orders' });
  }
};

// Total Revenue
const getTotalRevenue = async (req, res) => {
  try {
    const orders = await orderModel.find();
    const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
    res.json({ totalRevenue });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching total revenue' });
  }
};

// Total Users
const getTotalUsers = async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments();
    res.json({ totalUsers });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching total users' });
  }
};

// Total Products
const getTotalProducts = async (req, res) => {
  try {
    const totalProducts = await productModel.countDocuments();
    res.json({ totalProducts });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching total products' });
  }
};

// Monthly Sales Trend
const getMonthlySales = async (req, res) => {
  try {
    const orders = await orderModel.find();
    const revenueMap = {};
    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const key = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}`;
      revenueMap[key] = (revenueMap[key] || 0) + order.amount;
    });
    const monthlySales = Object.entries(revenueMap).map(([month, revenue]) => ({
      month,
      revenue,
    }));
    res.json(monthlySales);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching monthly sales' });
  }
};

// Top Selling Categories
const getTopCategories = async (req, res) => {
  try {
    const orders = await orderModel.find();
    const categoryMap = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        categoryMap[item.category] = (categoryMap[item.category] || 0) + item.quantity;
      });
    });
    const topCategories = Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
    res.json(topCategories);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching top categories' });
  }
};

// Top Products by Revenue
const getTopProductsByRevenue = async (req, res) => {
  try {
    const orders = await orderModel.find();
    const productRevenueMap = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const revenue = item.price * item.quantity;
        productRevenueMap[item.name] = (productRevenueMap[item.name] || 0) + revenue;
      });
    });
    const topProducts = Object.entries(productRevenueMap)
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    res.json(topProducts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching top products by revenue' });
  }
};

// User Registrations Over Time
const getUserRegistrations = async (req, res) => {
  try {
    const users = await userModel.find();
    const registrationMap = {};
    users.forEach(user => {
      const date = new Date(user.createdAt);
      const key = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}`;
      registrationMap[key] = (registrationMap[key] || 0) + 1;
    });
    const registrations = Object.entries(registrationMap).map(([month, count]) => ({
      month,
      count,
    }));
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user registrations' });
  }
};

// Recent Orders
const getRecentOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .sort({ createdAt: -1 })
      .limit(10);
    const recentOrders = orders.map(order => ({
      userId: order.userId,
      amount: order.amount,
      status: order.status,
      paymentMethod: order.paymentMethod,
      date: order.createdAt,
    }));
    res.json(recentOrders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching recent orders' });
  }
};

// Order Status Distribution
const getOrderStatusDistribution = async (req, res) => {
  try {
    const orders = await orderModel.find();
    const statusMap = {};
    orders.forEach(order => {
      statusMap[order.status] = (statusMap[order.status] || 0) + 1;
    });
    const statusDistribution = Object.entries(statusMap).map(([name, value]) => ({
      name,
      value,
    }));
    res.json(statusDistribution);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching order status distribution' });
  }
};

// Payment Method Usage
const getPaymentMethods = async (req, res) => {
  try {
    const orders = await orderModel.find();
    const methodCount = {};
    orders.forEach(order => {
      methodCount[order.paymentMethod] = (methodCount[order.paymentMethod] || 0) + 1;
    });
    const result = Object.entries(methodCount).map(([name, value]) => ({
      name,
      value,
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching payment methods' });
  }
};

export {
  getTotalOrders,
  getTotalRevenue,
  getTotalUsers,
  getTotalProducts,
  getMonthlySales,
  getTopCategories,
  getTopProductsByRevenue,
  getUserRegistrations,
  getRecentOrders,
  getOrderStatusDistribution,
  getPaymentMethods,
};
