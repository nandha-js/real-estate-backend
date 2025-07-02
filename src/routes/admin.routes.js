const express = require('express');
const {
  getDashboardStats,
  getUsersStats,
  getPropertiesStats,
  updateSystemSettings
} = require('../controllers/admin.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// Protect all admin routes and allow only admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsersStats);
router.get('/properties', getPropertiesStats);
router.put('/settings', updateSystemSettings);

module.exports = router;
