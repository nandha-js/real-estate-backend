const express = require('express');
const {
  getAgents,
  getAgent,
  createAgent,
  updateAgent,
  deleteAgent,
  getAgentProperties,
  getAgentStats
} = require('../controllers/agent.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public Routes
router.get('/', getAgents);
router.get('/:id', getAgent);
router.get('/:id/properties', getAgentProperties);
router.get('/:id/stats', getAgentStats);

// Protected Routes
router.post('/', protect, authorize('admin'), createAgent);
router.put('/:id', protect, authorize('agent', 'admin'), updateAgent);
router.delete('/:id', protect, authorize('admin'), deleteAgent);

module.exports = router;
