import express from 'express';
import {
  adminLogin,
  adminLogout,
  changeAdminPassword,
  changeAdminID,
  getDashboardStats,
} from '../controllers/adminController.js';
import isAuthenticated from '../middleware/authMiddleware.js';

const adminRouter = express.Router();

// Admin Login
adminRouter.post('/login', adminLogin);

// Admin Logout
adminRouter.post('/logout', adminLogout);

// Change Admin Password
adminRouter.put('/change-password', changeAdminPassword);

// Change Admin Email
adminRouter.put('/change-admin-id', changeAdminID);

// Dashboard Stats
adminRouter.get('/stats', getDashboardStats);

export default adminRouter;