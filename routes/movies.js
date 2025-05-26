const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Content = require('../models/Content');
const tmdbService = require('../services/tmdbService');

// Get trending content
router.get('/trending', auth, async (req, res) => {
  try {
    const { timeWindow = 'day' } = req.query;
    const content = await tmdbService.getTrending(timeWindow);
    res.json(content);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get popular content
router.get('/popular/:type', auth, async (req, res) => {
  try {
    const { type } = req.params;
    const { page = 1 } = req.query;
    
    let content;
    if (type === 'movie') {
      content = await tmdbService.getPopularMovies(page);
    } else if (type === 'tv') {
      content = await tmdbService.getPopularTVShows(page);
    } else {
      return res.status(400).json({ msg: 'Invalid content type' });
    }
    
    res.json(content);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get top rated content
router.get('/top/:type', auth, async (req, res) => {
  try {
    const { type } = req.params;
    const { page = 1 } = req.query;
    
    let content;
    if (type === 'movie') {
      content = await tmdbService.getTopRatedMovies(page);
    } else if (type === 'tv') {
      content = await tmdbService.getTopRatedTVShows(page);
    } else {
      return res.status(400).json({ msg: 'Invalid content type' });
    }
    
    res.json(content);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get upcoming movies
router.get('/upcoming', auth, async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const content = await tmdbService.getUpcomingMovies(page);
    res.json(content);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Search content
router.get('/search', auth, async (req, res) => {
  try {
    const { q, type = 'multi', page = 1 } = req.query;
    const content = await tmdbService.searchContent(q, type, page);
    res.json(content);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get content details
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;
    const content = await tmdbService.getContentDetails(id, type);
    res.json(content);
  } catch (error) {
    console.error('Error fetching content details:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get streaming providers
router.get('/:id/providers', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;
    const providers = type === 'movie' 
      ? await tmdbService.getMovieProviders(id)
      : await tmdbService.getTVShowProviders(id);
    res.json(providers);
  } catch (error) {
    console.error('Error fetching providers:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get similar content
router.get('/:id/similar', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;
    const similar = await tmdbService.getSimilarContent(id, type);
    res.json(similar);
  } catch (error) {
    console.error('Error fetching similar content:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get content by genre
router.get('/genre/:genreId', auth, async (req, res) => {
  try {
    const { genreId } = req.params;
    const { type, page } = req.query;
    const content = await tmdbService.getContentByGenre(genreId, type, page);
    res.json(content);
  } catch (error) {
    console.error('Error fetching content by genre:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get recommendations
router.get('/:id/recommendations', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { type = 'movie', page = 1 } = req.query;
    const content = await tmdbService.getRecommendations(id, type, page);
    res.json(content);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Add comment
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { text, rating } = req.body;
    let content = await Content.findOne({ _id: req.params.id });

    if (!content) {
      content = new Content({
        _id: req.params.id,
        comments: []
      });
    }

    const newComment = {
      user: req.user.id,
      text,
      rating
    };

    content.comments.unshift(newComment);

    // Update average rating
    if (rating) {
      content.totalRatings = (content.totalRatings || 0) + 1;
      content.averageRating = 
        ((content.averageRating || 0) * (content.totalRatings - 1) + rating) / content.totalRatings;
    }

    await content.save();
    res.json(content.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router; 