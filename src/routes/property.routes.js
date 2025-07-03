const express = require('express');
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertiesInRadius,
  propertyPhotoUpload
} = require('../controllers/property.controller');

const { protect, authorize } = require('../middlewares/auth.middleware');
const advancedResults = require('../middlewares/advancedResults.middleware');
const Property = require('../models/Property');

const router = express.Router();

// 👉 Radius search (must come before `/:id`)
router.get('/radius/:zipcode/:distance', getPropertiesInRadius);

// 👉 Public routes
router.get('/', advancedResults(Property, 'agent'), getProperties); // ✅ supports filters
router.get('/:id', getProperty);

// 👉 Protected routes (Agent/Admin)
router.post('/', protect, authorize('agent', 'admin'), createProperty);
router.put('/:id', protect, authorize('agent', 'admin'), updateProperty);
router.delete('/:id', protect, authorize('agent', 'admin'), deleteProperty);
router.put('/:id/photo', protect, authorize('agent', 'admin'), propertyPhotoUpload);

module.exports = router;
