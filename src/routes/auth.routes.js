const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword
} = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgot-password', forgotPassword); // ✅ FIXED: added hyphen
router.put('/reset-password/:resettoken', resetPassword); // ✅ FIXED: added hyphen

// Protected routes
router.get('/me', protect, getMe);
router.put('/update-details', protect, updateDetails); // ✅ added hyphen for consistency
router.put('/update-password', protect, updatePassword); // ✅ added hyphen

module.exports = router;
