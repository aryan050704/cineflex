const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const tmdbService = require('../services/tmdbService');

// Get user's watch history
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('watchHistory');
    const history = user.watchHistory || [];
    
    // Fetch additional details for each item in history
    const detailedHistory = await Promise.all(
      history.map(async (item) => {
        try {
          const details = await tmdbService.getMovieDetails(item.movieId);
          return {
            ...item,
            ...details
          };
        } catch (err) {
          console.error(`Error fetching details for movie ${item.movieId}:`, err);
          return item;
        }
      })
    );

    res.json(detailedHistory);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Add movie to watch history
router.post('/:movieId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { movieId } = req.params;

    // Get movie details from TMDB
    const movieDetails = await tmdbService.getMovieDetails(movieId);

    // Check if movie already exists in history
    const existingIndex = user.watchHistory.findIndex(
      item => item.movieId === movieId
    );

    if (existingIndex !== -1) {
      // Update watchedAt timestamp
      user.watchHistory[existingIndex].watchedAt = new Date();
    } else {
      // Add new movie to history
      user.watchHistory.unshift({
        movieId,
        title: movieDetails.title,
        watchedAt: new Date()
      });
    }

    await user.save();
    res.json(user.watchHistory);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router; 