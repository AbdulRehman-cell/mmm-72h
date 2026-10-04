const mongoose = require('mongoose');

const PerformancerecordsSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true
    },
    topicId: {
      type: String,
      required: [true, 'Topic ID is required'],
      trim: true
    },
    score: {
      type: Number,
      required: [true, 'Score is required']
    },
    correctAnswers: {
      type: Number,
      required: [true, 'Correct answers count is required']
    },
    totalQuestions: {
      type: Number,
      required: [true, 'Total questions count is required']
    },
    timeTaken: {
      type: Number,
      required: [true, 'Time taken is required']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Performancerecords', PerformancerecordsSchema);