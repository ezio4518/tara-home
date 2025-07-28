import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import { logger } from "../utils/logger.js";

// Total Orders
const getTotalOrders = async (req, res) => {
  try {
    const totalOrders = await orderModel.countDocuments();
    res.json({ totalOrders });
  } catch (error) {
    logger.error('Error fetching total orders', { error: error.message, stack: error.stack });
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
    logger.error('Error fetching total revenue', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Error fetching total revenue' });
  }
};

// Total Users
const getTotalUsers = async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments();
    res.json({ totalUsers });
  } catch (error) {
    logger.error('Error fetching total users', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Error fetching total users' });
  }
};

// Total Products
const getTotalProducts = async (req, res) => {
  try {
    const totalProducts = await productModel.countDocuments();
    res.json({ totalProducts });
  } catch (error) {
    logger.error('Error fetching total products', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Error fetching total products' });
  }
};

const getDailySales = async (req, res) => {
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // UTC-safe midnight

    const tenDaysAgo = new Date(today);
    tenDaysAgo.setUTCDate(today.getUTCDate() - 9); // last 10 days

    const orders = await orderModel.find({
      createdAt: {
        $gte: tenDaysAgo,
        $lte: new Date(today.getTime() + 86400000 - 1),
      },
    });

    const revenueMap = {};

    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const key = date.toISOString().split("T")[0]; // YYYY-MM-DD
      revenueMap[key] = (revenueMap[key] || 0) + order.amount;
    });

    const dailySales = [];
    for (let i = 0; i < 10; i++) {
      const d = new Date(tenDaysAgo);
      d.setUTCDate(tenDaysAgo.getUTCDate() + i);
      const key = d.toISOString().split("T")[0];
      dailySales.push({
        day: key,
        revenue: revenueMap[key] || 0,
      });
    }

    res.json(dailySales);
  } catch (error) {
    logger.error("Error fetching daily sales", { error: error.message, stack: error.stack });
    res.status(500).json({ error: "Error fetching daily sales" });
  }
};

const getWeeklySales = async (req, res) => {
  try {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (7 * 6)); // 7 weeks = 49 days ago
    startDate.setHours(0, 0, 0, 0);

    const orders = await orderModel.find({
      createdAt: {
        $gte: startDate,
        $lte: today,
      },
    });

    const revenueMap = {};

    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const year = date.getFullYear();
      const firstJan = new Date(year, 0, 1);
      const weekNumber = Math.ceil((((date - firstJan) / 86400000) + firstJan.getDay() + 1) / 7);
      const key = `${year}-W${weekNumber.toString().padStart(2, '0')}`;
      revenueMap[key] = (revenueMap[key] || 0) + order.amount;
    });

    // Generate last 7 week keys
    const weeklySales = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - (i * 7));
      const year = date.getFullYear();
      const firstJan = new Date(year, 0, 1);
      const weekNumber = Math.ceil((((date - firstJan) / 86400000) + firstJan.getDay() + 1) / 7);
      const key = `${year}-W${weekNumber.toString().padStart(2, '0')}`;
      weeklySales.push({
        week: key,
        revenue: revenueMap[key] || 0,
      });
    }

    res.json(weeklySales);
  } catch (error) {
    logger.error('Error fetching weekly sales', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Error fetching weekly sales' });
  }
};

// Monthly Sales Trend
const getMonthlySales = async (req, res) => {
  try {
    const today = new Date();
    const startMonth = new Date(today.getFullYear(), today.getMonth() - 4, 1); // 5 months ago

    const orders = await orderModel.find({
      createdAt: {
        $gte: startMonth,
        $lte: today,
      },
    });

    const revenueMap = {};

    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const key = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}`;
      revenueMap[key] = (revenueMap[key] || 0) + order.amount;
    });

    // Ensure all 5 months are included
    const monthlySales = [];
    for (let i = 4; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}`;
      monthlySales.push({
        month: key,
        revenue: revenueMap[key] || 0,
      });
    }

    res.json(monthlySales);
  } catch (error) {
    logger.error('Error fetching monthly sales', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Error fetching monthly sales' });
  }
};

const getYearlySales = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 4;

    const orders = await orderModel.find({
      createdAt: {
        $gte: new Date(`${startYear}-01-01T00:00:00.000Z`),
        $lte: new Date(`${currentYear}-12-31T23:59:59.999Z`),
      },
    });

    const revenueMap = {};

    orders.forEach(order => {
      const year = new Date(order.createdAt).getFullYear();
      revenueMap[year] = (revenueMap[year] || 0) + order.amount;
    });

    const yearlySales = [];
    for (let year = startYear; year <= currentYear; year++) {
      yearlySales.push({
        year: year.toString(),
        revenue: revenueMap[year] || 0,
      });
    }

    res.json(yearlySales);
  } catch (error) {
    logger.error('Error fetching yearly sales', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Error fetching yearly sales' });
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
    logger.error('Error fetching top categories', { error: error.message, stack: error.stack });
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
    logger.error('Error fetching top products by revenue', { error: error.message, stack: error.stack });
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
    logger.error('Error fetching user registrations', { error: error.message, stack: error.stack });
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
    logger.error('Error fetching recent orders', { error: error.message, stack: error.stack });
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
    logger.error('Error fetching order status distribution', { error: error.message, stack: error.stack });
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
    logger.error('Error fetching payment methods', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Error fetching payment methods' });
  }
};

export {
  getTotalOrders,
  getTotalRevenue,
  getTotalUsers,
  getTotalProducts,
  getDailySales,
  getWeeklySales,
  getMonthlySales,
  getYearlySales,
  getTopCategories,
  getTopProductsByRevenue,
  getUserRegistrations,
  getRecentOrders,
  getOrderStatusDistribution,
  getPaymentMethods,
};