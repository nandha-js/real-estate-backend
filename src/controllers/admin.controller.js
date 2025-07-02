const User = require('../models/User');
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async.middleware');

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  const [usersCount, propertiesCount, inquiriesCount] = await Promise.all([
    User.countDocuments(),
    Property.countDocuments(),
    Inquiry.countDocuments()
  ]);

  const recentUsers = await User.find().sort('-createdAt').limit(5);
  const recentProperties = await Property.find()
    .sort('-createdAt')
    .limit(5)
    .populate('agent');

  res.status(200).json({
    success: true,
    data: {
      counts: {
        users: usersCount,
        properties: propertiesCount,
        inquiries: inquiriesCount
      },
      recent: {
        users: recentUsers,
        properties: recentProperties
      }
    }
  });
});

// @desc    Get user role statistics
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsersStats = asyncHandler(async (req, res, next) => {
  const stats = await User.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: stats
  });
});

// @desc    Get property type and pricing statistics
// @route   GET /api/admin/properties
// @access  Private/Admin
exports.getPropertiesStats = asyncHandler(async (req, res, next) => {
  const stats = await Property.aggregate([
    {
      $group: {
        _id: '$propertyType',
        count: { $sum: 1 },
        avgPrice: { $avg: '$price' }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: stats
  });
});

// @desc    Update system settings (placeholder)
// @route   PUT /api/admin/settings
// @access  Private/Admin
exports.updateSystemSettings = asyncHandler(async (req, res, next) => {
  // In production, this should persist to DB
  const settings = {
    ...req.body,
    updatedAt: Date.now()
  };

  res.status(200).json({
    success: true,
    data: settings
  });
});
