const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['movie', 'tv'],
    default: 'movie'
  },
  genre: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  releaseDate: {
    type: Date,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  posterPath: {
    type: String,
    default: ''
  },
  backdropPath: {
    type: String,
    default: ''
  },
  tmdbId: {
    type: String,
    unique: true,
    sparse: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
ContentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Content', ContentSchema); 