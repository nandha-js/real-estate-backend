const express = require('express');
const {
  getInquiries,
  getInquiry,
  createInquiry,
  updateInquiry,
  deleteInquiry,
  getInquiriesByProperty,
  getInquiriesByUser
} = require('../controllers/contact.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// Public (authenticated) route to create inquiry
router.post('/', createInquiry);

// Admin/Agent only access
router.get('/', authorize('agent', 'admin'), getInquiries);
router.get('/:id', authorize('agent', 'admin'), getInquiry);
router.put('/:id', authorize('agent', 'admin'), updateInquiry);
router.delete('/:id', authorize('agent', 'admin'), deleteInquiry);

// Accessible to authenticated users to view their own inquiries
router.get('/property/:propertyId', getInquiriesByProperty);
router.get('/user/:userId', getInquiriesByUser);

module.exports = router;
