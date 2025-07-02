const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: String,
  author: String,
  cover: String,
  status: String,
  pageCount: Number,
  lastPageRead: Number,
  category: String,
  isFavorite: Boolean,
}, {
  timestamps: true, // ajoute automatiquement createdAt et updatedAt
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
