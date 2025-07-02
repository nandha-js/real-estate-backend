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

router.route('/')
  .get(getAgents)
  .post(protect, authorize('admin'), createAgent);

router.route('/:id')
  .get(getAgent)
  .put(protect, authorize('agent', 'admin'), updateAgent)
  .delete(protect, authorize('admin'), deleteAgent);

router.route('/:id/properties').get(getAgentProperties);
router.route('/:id/stats').get(getAgentStats);

module.exports = router;