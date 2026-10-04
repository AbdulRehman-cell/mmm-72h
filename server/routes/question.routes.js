const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'forgeai-admin-secret-change-me';

// Middleware to require Admin privileges
const requireAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Bearer token missing' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }
      
      // Verification successful, attach decoded token and proceed
      req.admin = decoded;
      next();
    });
  } catch (error) {
    return res.status(500).json({ error: 'Authentication processing failed' });
  }
};

// GET /api/questions - Public - Get list of questions (with optional topicId filtering)
router.get('/', async (req, res) => {
  try {
    const { topicId } = req.query;
    const filter = {};
    if (topicId) {
      filter.topicId = topicId;
    }
    const questions = await Question.find(filter);
    return res.status(200).json(questions);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to retrieve questions' });
  }
});

// GET /api/questions/:id - Public - Get single question
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    return res.status(200).json(question);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to retrieve the question' });
  }
});

// POST /api/questions - Public - Create a question
router.post('/', async (req, res) => {
  try {
    const { topicId, text, options, explanation } = req.body;

    if (!topicId || !text || !options) {
      return res.status(400).json({ error: 'Missing required fields: topicId, text, options' });
    }

    // Ensure options is parsed or stored as an array of strings
    const optionsArray = Array.isArray(options) 
      ? options 
      : typeof options === 'string' 
        ? options.split(',').map(o => o.trim())
        : [];

    const newQuestion = new Question({
      topicId,
      text,
      options: optionsArray,
      explanation: explanation || ''
    });

    const savedQuestion = await newQuestion.save();
    return res.status(201).json(savedQuestion);
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Failed to create question' });
  }
});

// PUT /api/questions/:id - Admin Only - Update a question
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { topicId, text, options, explanation } = req.body;

    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    if (topicId !== undefined) question.topicId = topicId;
    if (text !== undefined) question.text = text;
    if (options !== undefined) {
      question.options = Array.isArray(options)
        ? options
        : typeof options === 'string'
          ? options.split(',').map(o => o.trim())
          : options;
    }
    if (explanation !== undefined) question.explanation = explanation;

    const updatedQuestion = await question.save();
    return res.status(200).json(updatedQuestion);
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Failed to update question' });
  }
});

// DELETE /api/questions/:id - Admin Only - Delete a question
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    return res.status(200).json({ message: 'Question successfully deleted', id: req.params.id });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to delete question' });
  }
});

module.exports = router;