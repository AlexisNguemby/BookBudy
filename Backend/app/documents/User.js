const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  favorites: {
    type: [String], // ou [ObjectId] si ce sont des livres par ex.
    default: []
  },
  rewards: {
    type: Number,
    default: 0
  },
  profilePicture: {
    type: String,
    default: ''
  }
}, {
  timestamps: true // ajoute createdAt et updatedAt automatiquement
});

const User = mongoose.model('User', userSchema);

module.exports = User;
