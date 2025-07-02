const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  addFavorite,
  removeFavorite
} = require('../controllers/user.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// Protect all user routes
router.use(protect);

// Admin-only routes
router.get('/', authorize('admin'), getUsers);
router.post('/', authorize('admin'), createUser);
router.put('/:id', authorize('admin'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

// Accessible by the authenticated user
router.get('/:id', getUser);

// Favorite properties (user action)
router.post('/favorites/:propertyId', addFavorite);
router.delete('/favorites/:propertyId', removeFavorite);

module.exports = router;
