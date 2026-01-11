const SystemSettings = require('../models/SystemSettings');
const { validationResult } = require('express-validator');

// @desc    Get system settings
// @route   GET /api/settings
// @access  Private (Admin)
const getSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.getSettings();
    
    res.status(200).json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update system settings
// @route   PUT /api/settings
// @access  Private (Admin)
const updateSettings = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const settings = await SystemSettings.getSettings();
    
    // Update settings with provided data
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        settings[key] = req.body[key];
      }
    });

    settings.lastUpdatedBy = req.user.id;
    await settings.save();

    res.status(200).json({
      success: true,
      settings,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Reset settings to defaults
// @route   POST /api/settings/reset
// @access  Private (Admin)
const resetSettings = async (req, res) => {
  try {
    // Delete existing settings
    await SystemSettings.deleteMany({});
    
    // Create new default settings
    const settings = await SystemSettings.create({
      lastUpdatedBy: req.user.id
    });

    res.status(200).json({
      success: true,
      settings,
      message: 'Settings reset to defaults successfully'
    });
  } catch (error) {
    console.error('Reset settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get public settings (for non-admin users)
// @route   GET /api/settings/public
// @access  Public
const getPublicSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.getSettings();
    
    // Only return public-safe settings
    const publicSettings = {
      institutionName: settings.institutionName,
      institutionLogo: settings.institutionLogo,
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
      address: settings.address,
      currentSemester: settings.currentSemester,
      currentAcademicYear: settings.currentAcademicYear,
      maxCoursesPerStudent: settings.maxCoursesPerStudent,
      allowStudentRegistration: settings.allowStudentRegistration,
      maintenanceMode: settings.maintenanceMode,
      maintenanceMessage: settings.maintenanceMessage,
      primaryColor: settings.primaryColor,
      secondaryColor: settings.secondaryColor
    };

    res.status(200).json({
      success: true,
      settings: publicSettings
    });
  } catch (error) {
    console.error('Get public settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Backup settings
// @route   GET /api/settings/backup
// @access  Private (Admin)
const backupSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.getSettings();
    
    const backup = {
      settings: settings,
      backupDate: new Date(),
      backedUpBy: req.user.id
    };

    res.status(200).json({
      success: true,
      backup,
      message: 'Settings backup created successfully'
    });
  } catch (error) {
    console.error('Backup settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Restore settings from backup
// @route   POST /api/settings/restore
// @access  Private (Admin)
const restoreSettings = async (req, res) => {
  try {
    const { settings } = req.body;

    if (!settings) {
      return res.status(400).json({
        success: false,
        message: 'No settings data provided for restore'
      });
    }

    // Delete existing settings
    await SystemSettings.deleteMany({});
    
    // Create new settings from backup
    const restoredSettings = await SystemSettings.create({
      ...settings,
      lastUpdatedBy: req.user.id
    });

    res.status(200).json({
      success: true,
      settings: restoredSettings,
      message: 'Settings restored successfully'
    });
  } catch (error) {
    console.error('Restore settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Toggle maintenance mode
// @route   POST /api/settings/maintenance
// @access  Private (Admin)
const toggleMaintenance = async (req, res) => {
  try {
    const { maintenanceMode, maintenanceMessage } = req.body;

    const settings = await SystemSettings.getSettings();
    
    settings.maintenanceMode = maintenanceMode !== undefined ? maintenanceMode : !settings.maintenanceMode;
    
    if (maintenanceMessage) {
      settings.maintenanceMessage = maintenanceMessage;
    }

    settings.lastUpdatedBy = req.user.id;
    await settings.save();

    res.status(200).json({
      success: true,
      settings: {
        maintenanceMode: settings.maintenanceMode,
        maintenanceMessage: settings.maintenanceMessage
      },
      message: `Maintenance mode ${settings.maintenanceMode ? 'enabled' : 'disabled'} successfully`
    });
  } catch (error) {
    console.error('Toggle maintenance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get system health status
// @route   GET /api/settings/health
// @access  Private (Admin)
const getSystemHealth = async (req, res) => {
  try {
    const User = require('../models/User');
    const Course = require('../models/Course');
    const Assignment = require('../models/Assignment');
    const Grade = require('../models/Grade');

    // Get database statistics
    const userCount = await User.countDocuments();
    const courseCount = await Course.countDocuments();
    const assignmentCount = await Assignment.countDocuments();
    const gradeCount = await Grade.countDocuments();

    // Get system settings
    const settings = await SystemSettings.getSettings();

    // Calculate system health metrics
    const health = {
      database: {
        status: 'healthy',
        connections: {
          users: userCount,
          courses: courseCount,
          assignments: assignmentCount,
          grades: gradeCount
        }
      },
      system: {
        maintenanceMode: settings.maintenanceMode,
        allowStudentRegistration: settings.allowStudentRegistration,
        autoBackup: settings.autoBackup,
        enableAuditLog: settings.enableAuditLog
      },
      performance: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version
      }
    };

    res.status(200).json({
      success: true,
      health,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Get system health error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  resetSettings,
  getPublicSettings,
  backupSettings,
  restoreSettings,
  toggleMaintenance,
  getSystemHealth
};
