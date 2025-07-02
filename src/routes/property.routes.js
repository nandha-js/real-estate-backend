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

// Public routes
router.get('/', advancedResults(Property, 'agent'), getProperties);
router.get('/:id', getProperty);
router.get('/radius/:zipcode/:distance', getPropertiesInRadius);

// Protected routes
router.post('/', protect, authorize('agent', 'admin'), createProperty);
router.put('/:id', protect, authorize('agent', 'admin'), updateProperty);
router.delete('/:id', protect, authorize('agent', 'admin'), deleteProperty);
router.put('/:id/photo', protect, authorize('agent', 'admin'), propertyPhotoUpload);

module.exports = router;
