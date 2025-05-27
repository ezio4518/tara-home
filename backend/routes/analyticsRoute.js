import express from 'express';
import {
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
} from '../controllers/analyticsController.js';

const analyticsRouter = express.Router();

analyticsRouter.get('/total-orders', getTotalOrders);
analyticsRouter.get('/total-revenue', getTotalRevenue);
analyticsRouter.get('/total-users', getTotalUsers);
analyticsRouter.get('/total-products', getTotalProducts);
analyticsRouter.get('/monthly-sales', getMonthlySales);
analyticsRouter.get('/top-categories', getTopCategories);
analyticsRouter.get('/top-products-revenue', getTopProductsByRevenue);
analyticsRouter.get('/user-registrations', getUserRegistrations);
analyticsRouter.get('/recent-orders', getRecentOrders);
analyticsRouter.get('/order-status-distribution', getOrderStatusDistribution);
analyticsRouter.get('/payment-methods', getPaymentMethods);

export default analyticsRouter;
