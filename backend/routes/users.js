const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateProfile,
  getCurrentUserProfile,
  uploadProfileImage,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// File upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, 'profile-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Validation rules
const createUserValidation = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ max: 50 })
    .withMessage('Full name cannot be more than 50 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['admin', 'student', 'lecturer'])
    .withMessage('Role must be either admin, student, or lecturer'),
];

const updateUserValidation = [
  body('fullName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Full name cannot be empty')
    .isLength({ max: 50 })
    .withMessage('Full name cannot be more than 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('role')
    .optional()
    .isIn(['admin', 'student', 'lecturer'])
    .withMessage('Role must be either admin, student, or lecturer'),
];

const updateProfileValidation = [
  body('fullName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Full name cannot be empty')
    .isLength({ max: 50 })
    .withMessage('Full name cannot be more than 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
];

// Admin routes
router.get('/', protect, admin, getUsers);
router.post('/', protect, admin, createUserValidation, createUser);
router.put('/:id', protect, admin, updateUserValidation, updateUser);
router.delete('/:id', protect, admin, deleteUser);

// User routes (must come before /:id route)
router.get('/profile', protect, getCurrentUserProfile);
router.put('/profile', protect, updateProfile);
router.post('/upload-profile-image', protect, upload.single('profileImage'), uploadProfileImage);

// Test route
router.get('/test', protect, (req, res) => {
  res.json({ message: 'Test route works', user: req.user });
});

// Admin routes that need :id parameter
router.get('/:id', protect, admin, getUser);

module.exports = router;
