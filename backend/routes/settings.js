const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getSettings,
  updateSettings,
  resetSettings,
  getPublicSettings,
  backupSettings,
  restoreSettings,
  toggleMaintenance,
  getSystemHealth
} = require('../controllers/settingsController');

const router = express.Router();

// @route   GET /api/settings
// @desc    Get system settings
// @access  Private (Admin)
router.get('/', protect, authorize('admin'), getSettings);

// @route   PUT /api/settings
// @desc    Update system settings
// @access  Private (Admin)
router.put('/', protect, authorize('admin'), updateSettings);

// @route   POST /api/settings/reset
// @desc    Reset settings to defaults
// @access  Private (Admin)
router.post('/reset', protect, authorize('admin'), resetSettings);

// @route   GET /api/settings/public
// @desc    Get public settings
// @access  Public
router.get('/public', getPublicSettings);

// @route   GET /api/settings/backup
// @desc    Backup settings
// @access  Private (Admin)
router.get('/backup', protect, authorize('admin'), backupSettings);

// @route   POST /api/settings/restore
// @desc    Restore settings from backup
// @access  Private (Admin)
router.post('/restore', protect, authorize('admin'), restoreSettings);

// @route   POST /api/settings/maintenance
// @desc    Toggle maintenance mode
// @access  Private (Admin)
router.post('/maintenance', protect, authorize('admin'), toggleMaintenance);

// @route   GET /api/settings/health
// @desc    Get system health status
// @access  Private (Admin)
router.get('/health', protect, authorize('admin'), getSystemHealth);

module.exports = router;
