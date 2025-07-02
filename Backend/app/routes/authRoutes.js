const express = require('express');
const router = express.Router();
const { register, login, logout, getProfile, updateProfile } = require('../controllers/AuthController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);


router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
