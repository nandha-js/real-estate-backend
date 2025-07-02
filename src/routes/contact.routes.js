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

router.use(protect);

router.route('/')
  .get(authorize('agent', 'admin'), getInquiries)
  .post(createInquiry);

router.route('/:id')
  .get(authorize('agent', 'admin'), getInquiry)
  .put(authorize('agent', 'admin'), updateInquiry)
  .delete(authorize('agent', 'admin'), deleteInquiry);

router.route('/property/:propertyId').get(getInquiriesByProperty);
router.route('/user/:userId').get(getInquiriesByUser);

module.exports = router;