const express = require('express');
const router = express.Router();

const { protect } = require('../middlewares/authMiddleware');
const { addBookToCollection, getUserBooks } = require('../controllers/bookController');

router.post('/', protect, addBookToCollection);
router.get('/', protect, getUserBooks); // get user books

module.exports = router;
