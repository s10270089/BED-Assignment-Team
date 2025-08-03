const express = require('express');
const router = express.Router();
const userprofileController = require('../controllers/userprofileController');
const validateUserProfile = require('../middlewares/validateUserProfile');

// Get all user profiles (no auth needed for now)
router.get('/', userprofileController.getAllUserProfiles);

// Get user profile by ID (no auth needed for now)
router.get('/:id', userprofileController.getUserProfileById);

// Update user profile (WITH authentication)
router.put('/:id', userprofileController.verifyToken, validateUserProfile, userprofileController.updateUserProfile);

// Delete user profile (WITH authentication)
router.delete('/:id', userprofileController.verifyToken, userprofileController.deleteUserProfile);

module.exports = router;