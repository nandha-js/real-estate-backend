const User = require('../models/User');
const Property = require('../models/Property');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async.middleware');
const geocoder = require('../utils/geocoder');

// @desc     Get all agents   
// @route    GET /api/agents
// @access  Public
exports.getAgents = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single agent
// @route   GET /api/agents/:id
// @access  Public
exports.getAgent = asyncHandler(async (req, res, next) => {
  const agent = await User.findById(req.params.id)
    .where('role').equals('agent');

  if (!agent) {
    return next(
      new ErrorResponse(`Agent not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: agent });
});

// @desc    Create agent
// @route   POST /api/agents
// @access  Private/Admin
exports.createAgent = asyncHandler(async (req, res, next) => {
  // Set role to agent
  req.body.role = 'agent';

  const agent = await User.create(req.body);

  res.status(201).json({ success: true, data: agent });
});

// @desc    Update agent
// @route   PUT /api/agents/:id
// @access  Private/Agent/Admin
exports.updateAgent = asyncHandler(async (req, res, next) => {
  let agent = await User.findById(req.params.id)
    .where('role').equals('agent');

  if (!agent) {
    return next(
      new ErrorResponse(`Agent not found with id of ${req.params.id}`, 404)
    );
  }

  agent = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: agent });
});

// @desc    Delete agent
// @route   DELETE /api/agents/:id
// @access  Private/Admin
exports.deleteAgent = asyncHandler(async (req, res, next) => {
  const agent = await User.findById(req.params.id)
    .where('role').equals('agent');

  if (!agent) {
    return next(
      new ErrorResponse(`Agent not found with id of ${req.params.id}`, 404)
    );
  }

  await agent.remove();

  res.status(200).json({ success: true, data: {} });
});

// @desc    Get properties by agent
// @route   GET /api/agents/:id/properties
// @access  Public
exports.getAgentProperties = asyncHandler(async (req, res, next) => {
  const properties = await Property.find({ agent: req.params.id });

  res.status(200).json({ success: true, count: properties.length, data: properties });
});

// @desc    Get agent stats
// @route   GET /api/agents/:id/stats
// @access  Public
exports.getAgentStats = asyncHandler(async (req, res, next) => {
  const stats = await Property.aggregate([
    { $match: { agent: mongoose.Types.ObjectId(req.params.id) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgPrice: { $avg: '$price' }
      }
    }
  ]);

  res.status(200).json({ success: true, data: stats });
});