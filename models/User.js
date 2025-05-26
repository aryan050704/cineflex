const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  watchHistory: [{
    movieId: String,
    title: String,
    watchedAt: {
      type: Date,
      default: Date.now
    }
  }],
  preferences: {
    genres: [String],
    favoriteMovies: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema); 