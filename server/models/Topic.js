const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Topic name is required'],
      trim: true,
      unique: true
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      trim: true,
      unique: true,
      lowercase: true
    },
    icon: {
      type: String,
      required: [true, 'Icon identifier or class is required'],
      trim: true,
      default: '🎯'
    },
    color: {
      type: String,
      required: [true, 'Color hex or name is required'],
      trim: true,
      default: '#3b82f6'
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty level is required'],
      enum: ['Easy', 'Medium', 'Hard', 'Expert'],
      default: 'Medium'
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook to ensure slug is generated and sanitized
TopicSchema.pre('validate', function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

module.exports = mongoose.model('Topic', TopicSchema);