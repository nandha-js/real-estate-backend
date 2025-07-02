const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async.middleware');
const sendEmail = require('../utils/sendEmail');

// @desc    Get all inquiries
// @route   GET /api/contact
// @access  Private/Agent/Admin
exports.getInquiries = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single inquiry
// @route   GET /api/contact/:id
// @access  Private/Agent/Admin
exports.getInquiry = asyncHandler(async (req, res, next) => {
  const inquiry = await Inquiry.findById(req.params.id).populate('property user');

  if (!inquiry) {
    return next(new ErrorResponse(`Inquiry not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: inquiry });
});

// @desc    Create inquiry
// @route   POST /api/contact
// @access  Private
exports.createInquiry = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  const property = await Property.findById(req.body.property).populate('agent');

  if (!property) {
    return next(new ErrorResponse('Property not found', 404));
  }

  const inquiry = await Inquiry.create(req.body);

  // Send email to agent
  try {
    await new sendEmail({
      email: property.agent.email,
      subject: 'New Property Inquiry',
      message: `You have a new inquiry for "${property.title}" from ${req.user.name}`
    }).send('inquiryNotification');
  } catch (err) {
    console.error('Error sending email to agent:', err.message);
  }

  res.status(201).json({ success: true, data: inquiry });
});

// @desc    Update inquiry
// @route   PUT /api/contact/:id
// @access  Private/Agent/Admin
exports.updateInquiry = asyncHandler(async (req, res, next) => {
  let inquiry = await Inquiry.findById(req.params.id);

  if (!inquiry) {
    return next(new ErrorResponse(`Inquiry not found with id of ${req.params.id}`, 404));
  }

  inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: inquiry });
});

// @desc    Delete inquiry
// @route   DELETE /api/contact/:id
// @access  Private/Agent/Admin
exports.deleteInquiry = asyncHandler(async (req, res, next) => {
  const inquiry = await Inquiry.findById(req.params.id);

  if (!inquiry) {
    return next(new ErrorResponse(`Inquiry not found with id of ${req.params.id}`, 404));
  }

  await inquiry.remove();

  res.status(200).json({ success: true, data: {} });
});

// @desc    Get inquiries by property
// @route   GET /api/contact/property/:propertyId
// @access  Private/Agent/Admin
exports.getInquiriesByProperty = asyncHandler(async (req, res, next) => {
  const inquiries = await Inquiry.find({ property: req.params.propertyId }).populate('user');

  res.status(200).json({ success: true, count: inquiries.length, data: inquiries });
});

// @desc    Get inquiries by user
// @route   GET /api/contact/user/:userId
// @access  Private
exports.getInquiriesByUser = asyncHandler(async (req, res, next) => {
  const inquiries = await Inquiry.find({ user: req.params.userId }).populate('property');

  res.status(200).json({ success: true, count: inquiries.length, data: inquiries });
});
