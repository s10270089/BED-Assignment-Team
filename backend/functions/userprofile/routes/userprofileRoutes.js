const express = require('express');
const router = express.Router();
const userprofileController = require('../controllers/userprofileController');
const validateUserProfile = require('../middlewares/validateUserProfile');
// Get all user profiles
router.get('/', userprofileController.getAllUserProfiles);

// Get user profile by ID
router.get('/:id', userprofileController.getUserProfileById);

// Create user profile
router.post('/', validateUserProfile, userprofileController.createUserProfile);

// Update user profile
router.put('/:id', validateUserProfile, userprofileController.updateUserProfile);

// Delete user profile
router.delete('/:id', userprofileController.deleteUserProfile);

module.exports = router;