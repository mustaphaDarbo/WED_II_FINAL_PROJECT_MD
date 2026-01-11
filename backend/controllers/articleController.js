const Article = require('../models/Article');
const { validationResult } = require('express-validator');

// @desc    Get all articles (public - only published)
// @route   GET /api/articles
// @access  Public
const getArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const articles = await Article.find({ status: 'published' })
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Article.countDocuments({ status: 'published' });

    res.status(200).json({
      success: true,
      count: articles.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      articles,
    });
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single article
// @route   GET /api/articles/:id
// @access  Public
const getArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('author', 'name');

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Only show published articles to public
    if (article.status !== 'published' && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.status(200).json({
      success: true,
      article,
    });
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all articles (admin - includes drafts)
// @route   GET /api/articles/admin/all
// @access  Private/Admin
const getAllArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const articles = await Article.find({})
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Article.countDocuments();

    res.status(200).json({
      success: true,
      count: articles.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      articles,
    });
  } catch (error) {
    console.error('Get all articles error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create article
// @route   POST /api/articles
// @access  Private/Admin
const createArticle = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { title, description, content, status, tags, readTime, category } = req.body;

    const article = await Article.create({
      title,
      description,
      content,
      category,
      image: req.file ? `/uploads/${req.file.filename}` : '',
      status: status || 'draft',
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      readTime: readTime || 5,
      author: req.user.id,
    });

    const populatedArticle = await Article.findById(article._id)
      .populate('author', 'name email');

    res.status(201).json({
      success: true,
      article: populatedArticle,
    });
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update article
// @route   PUT /api/articles/:id
// @access  Private/Admin
const updateArticle = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    let article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const { title, description, content, status, tags, readTime } = req.body;

    const updateData = {
      title,
      description,
      content,
      status,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : article.tags,
      readTime: readTime || article.readTime,
    };

    // Update image if new one uploaded
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    article = await Article.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'name email');

    res.status(200).json({
      success: true,
      article,
    });
  } catch (error) {
    console.error('Update article error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete article
// @route   DELETE /api/articles/:id
// @access  Private/Admin
const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    await Article.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Article deleted successfully',
    });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/articles/stats
// @access  Private/Admin
const getStats = async (req, res) => {
  try {
    const totalArticles = await Article.countDocuments();
    const publishedArticles = await Article.countDocuments({ status: 'published' });
    const draftArticles = await Article.countDocuments({ status: 'draft' });
    const totalUsers = await require('../models/User').countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        totalArticles,
        publishedArticles,
        draftArticles,
        totalUsers,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getArticles,
  getArticle,
  getAllArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  getStats,
};
