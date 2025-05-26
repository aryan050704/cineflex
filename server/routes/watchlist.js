const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Content = require('../models/Content');

// Get user's watchlist
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('watchlist');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.watchlist);
  } catch (err) {
    console.error('Error fetching watchlist:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add content to watchlist
router.post('/:contentId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const content = await Content.findById(req.params.contentId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Check if content is already in watchlist
    if (user.watchlist.includes(req.params.contentId)) {
      return res.status(400).json({ message: 'Content already in watchlist' });
    }

    user.watchlist.push(req.params.contentId);
    await user.save();

    res.json({ message: 'Content added to watchlist' });
  } catch (err) {
    console.error('Error adding to watchlist:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove content from watchlist
router.delete('/:contentId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if content is in watchlist
    if (!user.watchlist.includes(req.params.contentId)) {
      return res.status(400).json({ message: 'Content not in watchlist' });
    }

    user.watchlist = user.watchlist.filter(
      id => id.toString() !== req.params.contentId
    );
    await user.save();

    res.json({ message: 'Content removed from watchlist' });
  } catch (err) {
    console.error('Error removing from watchlist:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check if content is in watchlist
router.get('/check/:contentId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isInWatchlist = user.watchlist.includes(req.params.contentId);
    res.json({ isInWatchlist });
  } catch (err) {
    console.error('Error checking watchlist:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 