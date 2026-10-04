const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Topic = require('../models/Topic');

// Admin JWT Secret
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'forgeai-admin-secret-change-me';

/**
 * requireAdmin Middleware
 * Verifies bearer token in Authorization header.
 * If valid, attaches admin to request, otherwise returns 401/403.
 */
const requireAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required. Missing token.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded && decoded.role === 'admin') {
      req.admin = decoded;
      next();
    } else {
      return res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.', error: error.message });
  }
};

/**
 * GET /api/topics
 * PUBLIC
 * Retrieve a list of all trivia topics.
 */
router.get('/', async (req, res) => {
  try {
    const topics = await Topic.find({}).sort({ name: 1 });
    return res.status(200).json(topics);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to retrieve topics', error: error.message });
  }
});

/**
 * GET /api/topics/:id
 * PUBLIC
 * Retrieve a single trivia topic by ID or Slug.
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Attempt lookup by MongoDB ObjectId or URL Slug
    let topic = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      topic = await Topic.findById(id);
    }
    
    if (!topic) {
      topic = await Topic.findOne({ slug: id });
    }

    if (!topic) {
      return res.status(404).json({ message: `Topic not found for identifier: ${id}` });
    }

    return res.status(200).json(topic);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving topic details', error: error.message });
  }
});

/**
 * POST /api/topics
 * PUBLIC
 * Create a new trivia topic (Used by both admin panel creators and visitors submitting new categories)
 */
router.post('/', async (req, res) => {
  try {
    const { name, slug, icon, color, difficulty } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: 'Missing required fields: name and slug are required.' });
    }

    // Check for existing slug
    const existingTopic = await Topic.findOne({ slug: slug.toLowerCase().trim() });
    if (existingTopic) {
      return res.status(400).json({ message: `A topic with the slug '${slug}' already exists.` });
    }

    const newTopic = new Topic({
      name: name.trim(),
      slug: slug.toLowerCase().trim(),
      icon: icon ? icon.trim() : '🏆',
      color: color ? color.trim() : '#4F46E5',
      difficulty: difficulty ? difficulty.trim() : 'Intermediate'
    });

    const savedTopic = await newTopic.save();
    return res.status(201).json(savedTopic);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to create trivia topic', error: error.message });
  }
});

/**
 * PUT /api/topics/:id
 * REQUIRE ADMIN
 * Update an existing trivia topic configuration.
 */
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, icon, color, difficulty } = req.body;

    // Validate if the topic exists
    const topic = await Topic.findById(id);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found.' });
    }

    // If changing the slug, verify uniqueness
    if (slug && slug.toLowerCase().trim() !== topic.slug) {
      const existingSlug = await Topic.findOne({ slug: slug.toLowerCase().trim() });
      if (existingSlug) {
        return res.status(400).json({ message: `The slug '${slug}' is already assigned to another topic.` });
      }
      topic.slug = slug.toLowerCase().trim();
    }

    if (name) topic.name = name.trim();
    if (icon) topic.icon = icon.trim();
    if (color) topic.color = color.trim();
    if (difficulty) topic.difficulty = difficulty.trim();

    const updatedTopic = await topic.save();
    return res.status(200).json(updatedTopic);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to update topic details', error: error.message });
  }
});

/**
 * DELETE /api/topics/:id
 * REQUIRE ADMIN
 * Delete a trivia topic.
 */
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const topic = await Topic.findByIdAndDelete(id);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found or already deleted.' });
    }

    return res.status(200).json({ message: 'Topic successfully deleted', deletedTopicId: id });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete topic', error: error.message });
  }
});

module.exports = router;