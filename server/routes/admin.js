const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const User = require('../models/User');
const Content = require('../models/Content');

// Get all users (admin only)
router.get('/users', [auth, admin], async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all content (admin only)
router.get('/content', [auth, admin], async (req, res) => {
  try {
    const content = await Content.find();
    res.json(content);
  } catch (err) {
    console.error('Error fetching content:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new content (admin only)
router.post('/content', [auth, admin], async (req, res) => {
  try {
    const { title, type, genre, description, releaseDate, rating } = req.body;

    const newContent = new Content({
      title,
      type,
      genre,
      description,
      releaseDate,
      rating
    });

    await newContent.save();
    res.status(201).json(newContent);
  } catch (err) {
    console.error('Error adding content:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update content (admin only)
router.put('/content/:id', [auth, admin], async (req, res) => {
  try {
    const { title, type, genre, description, releaseDate, rating } = req.body;

    const content = await Content.findByIdAndUpdate(
      req.params.id,
      {
        title,
        type,
        genre,
        description,
        releaseDate,
        rating
      },
      { new: true }
    );

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json(content);
  } catch (err) {
    console.error('Error updating content:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete content (admin only)
router.delete('/content/:id', [auth, admin], async (req, res) => {
  try {
    const content = await Content.findByIdAndDelete(req.params.id);

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json({ message: 'Content deleted successfully' });
  } catch (err) {
    console.error('Error deleting content:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user role (admin only)
router.put('/users/:id/role', [auth, admin], async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error updating user role:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 