const express = require('express');
const { body } = require('express-validator');
const {
  getArticles,
  getArticle,
  getAllArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  getStats,
} = require('../controllers/articleController');
const { protect, admin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Set up multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Allow only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

const router = express.Router();

// Validation rules
const createArticleValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot be more than 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 300 })
    .withMessage('Description cannot be more than 300 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['announcement', 'academic', 'news', 'event', 'policy'])
    .withMessage('Category must be valid'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be either draft or published'),
];

const updateArticleValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Title cannot be more than 100 characters'),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Description cannot be empty')
    .isLength({ max: 300 })
    .withMessage('Description cannot be more than 300 characters'),
  body('content')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Content cannot be empty'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be either draft or published'),
];

// Public routes
router.get('/', getArticles);
router.get('/:id', getArticle);

// Admin routes
router.get('/admin/all', protect, admin, getAllArticles);
router.get('/stats', protect, admin, getStats);
router.post('/', protect, admin, upload.single('image'), createArticleValidation, createArticle);
router.put('/:id', protect, admin, upload.single('image'), updateArticleValidation, updateArticle);
router.delete('/:id', protect, admin, deleteArticle);

module.exports = router;
