// routes/ratingRoutes.js
const express = require('express');
const router = express.Router();
const { submitRating } = require('../controllers/ratingController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, submitRating);

module.exports = router;
