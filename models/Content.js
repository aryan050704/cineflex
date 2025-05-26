const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['movie', 'tv_show', 'series'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  poster: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  genres: [{
    type: String,
    required: true
  }],
  releaseDate: {
    type: Date,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  youtubeTrailer: {
    type: String,
    required: true
  },
  bookMyShowLink: String,
  wikipediaLink: String,
  seasons: [{
    seasonNumber: Number,
    episodes: [{
      episodeNumber: Number,
      title: String,
      description: String,
      duration: String,
      videoUrl: String
    }]
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  totalRatings: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add text index for search functionality
contentSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Content', contentSchema); 