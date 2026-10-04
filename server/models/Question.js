const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema(
  {
    topicId: {
      type: String,
      required: [true, 'Topic ID is required'],
      trim: true,
      index: true
    },
    text: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true
    },
    options: {
      type: [String],
      required: [true, 'Options array is required'],
      default: ['Option A', 'Option B', 'Option C', '*Option D']
    },
    explanation: {
      type: String,
      trim: true,
      default: 'No explanation provided for this trivia question.'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Question', QuestionSchema);