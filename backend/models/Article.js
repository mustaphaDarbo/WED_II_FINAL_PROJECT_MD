const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Please provide content']
  },
  image: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please specify who created this article']
  },
  category: {
    type: String,
    enum: ['announcement', 'academic', 'news', 'event', 'policy'],
    required: [true, 'Please specify article category']
  },
  targetAudience: [{
    type: String,
    enum: ['admin', 'lecturer', 'student'],
    required: [true, 'Please specify target audience']
  }],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  publishedAt: {
    type: Date
  },
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Virtual for article URL
ArticleSchema.virtual('url').get(function() {
  return `/articles/${this._id}`;
});

// Ensure virtual fields are serialized
ArticleSchema.set('toJSON', { virtuals: true });
ArticleSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Article', ArticleSchema);
