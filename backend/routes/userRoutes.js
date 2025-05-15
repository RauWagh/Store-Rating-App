// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getAllUsers, updatePassword } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getAllUsers);
router.put('/update-password', authMiddleware, updatePassword);

module.exports = router;
