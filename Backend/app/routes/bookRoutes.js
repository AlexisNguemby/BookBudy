const express = require('express');
const router = express.Router();

const { protect } = require('../middlewares/authMiddleware');
const { addBookToCollection, getUserBooks, updateBook } = require('../controllers/bookController');

router.post('/', protect, addBookToCollection);
router.get('/', protect, getUserBooks); // get user books
router.put('/:id', protect, updateBook); // update book

module.exports = router;
