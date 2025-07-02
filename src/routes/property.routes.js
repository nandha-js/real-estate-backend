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

router
  .route('/')
  .get(advancedResults(Property, 'agent'), getProperties)
  .post(protect, authorize('agent', 'admin'), createProperty);

router
  .route('/:id')
  .get(getProperty)
  .put(protect, authorize('agent', 'admin'), updateProperty)
  .delete(protect, authorize('agent', 'admin'), deleteProperty);

router.route('/radius/:zipcode/:distance').get(getPropertiesInRadius);
router.route('/:id/photo').put(protect, authorize('agent', 'admin'), propertyPhotoUpload);

module.exports = router;