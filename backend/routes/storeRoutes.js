// routes/storeRoutes.js
const express = require('express');
const router = express.Router();
const {
  createStore,
  getAllStores,
  getStoreRatingsByOwner,
} = require('../controllers/storeController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createStore); // Admin creates store
router.get('/', authMiddleware, getAllStores); // All users
router.get('/my-store', authMiddleware, getStoreRatingsByOwner); // Store owner

module.exports = router;
