const Property = require('../models/Property');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async.middleware');
const geocoder = require('../utils/geocoder');
const cloudinary = require('cloudinary').v2;

// @desc    Get all properties with filters
// @route   GET /api/properties
// @access  Public
exports.getProperties = asyncHandler(async (req, res) => {
  const { q, type, minPrice, maxPrice, bedrooms, bathrooms } = req.query;

  let query = {};

  if (q) {
    query.title = { $regex: q, $options: 'i' };
  }
  if (type) {
    query.type = type;
  }
  if (minPrice) {
    query.price = { ...query.price, $gte: Number(minPrice) };
  }
  if (maxPrice) {
    query.price = { ...query.price, $lte: Number(maxPrice) };
  }
  if (bedrooms) {
    query.bedrooms = Number(bedrooms);
  }
  if (bathrooms) {
    query.bathrooms = Number(bathrooms);
  }

  const properties = await Property.find(query).populate('agent', 'name email phone');

  res.status(200).json({
    success: true,
    count: properties.length,
    data: properties,
  });
});

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
exports.getProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id).populate('agent');
  if (!property) {
    return next(new ErrorResponse(`Property not found with id ${req.params.id}`, 404));
  }
  res.status(200).json({ success: true, data: property });
});

// @desc    Create property
// @route   POST /api/properties
// @access  Private (Agent/Admin)
exports.createProperty = asyncHandler(async (req, res) => {
  req.body.agent = req.user.id;
  const property = await Property.create(req.body);
  res.status(201).json({ success: true, data: property });
});

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Agent/Admin)
exports.updateProperty = asyncHandler(async (req, res, next) => {
  let property = await Property.findById(req.params.id);
  if (!property) return next(new ErrorResponse(`Property not found`, 404));

  if (property.agent.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to update this property`, 403));
  }

  property = await Property.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: property });
});

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Agent/Admin)
exports.deleteProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id);
  if (!property) return next(new ErrorResponse(`Property not found`, 404));

  if (property.agent.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to delete this property`, 403));
  }

  await property.remove();
  res.status(200).json({ success: true, data: {} });
});

// @desc    Get properties within a radius
// @route   GET /api/properties/radius/:zipcode/:distance
// @access  Public
exports.getPropertiesInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  const loc = await geocoder.geocode(zipcode);
  if (!loc || loc.length === 0) {
    return next(new ErrorResponse(`Invalid location`, 400));
  }

  const lat = loc[0].latitude;
  const lng = loc[0].longitude;
  const radius = distance / 3963;

  const properties = await Property.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: properties.length,
    data: properties,
  });
});

// @desc    Upload photo for property
// @route   PUT /api/properties/:id/photo
// @access  Private (Agent/Admin)
exports.propertyPhotoUpload = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id);
  if (!property) return next(new ErrorResponse(`Property not found`, 404));

  if (property.agent.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to upload image`, 403));
  }

  if (!req.files || !req.files.file) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(`File must be less than ${process.env.MAX_FILE_UPLOAD}`, 400)
    );
  }

  const result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: 'real-estate',
    width: 1500,
    height: 1000,
    crop: 'scale',
  });

  property.images.push({
    url: result.secure_url,
    public_id: result.public_id,
  });

  await property.save();

  res.status(200).json({ success: true, data: property });
});
