const express = require('express');
const {
  getDashboardStats,
  getUsersStats,
  getPropertiesStats,
  updateSystemSettings
} = require('../controllers/admin.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsersStats);
router.get('/properties', getPropertiesStats);
router.put('/settings', updateSystemSettings);

module.exports = router;