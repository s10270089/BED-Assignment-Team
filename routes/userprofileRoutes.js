const express = require('express');
const router = express.Router();
const userprofileController = require('../controllers/userprofileController');
const validateUserProfile = require('../middlewares/validateUserProfile');

// Get all user profiles (no auth needed for now)
router.get('/', userprofileController.getAllUserProfiles);

// Get user profile by ID (no auth needed for now)
router.get('/:id', userprofileController.getUserProfileById);

// Get user profile by user_id
router.get('/user/:userId', userprofileController.getUserProfileByUserId);

// Update user profile by user_id (WITH authentication)
router.put('/user/:userId', userprofileController.verifyToken, validateUserProfile, userprofileController.updateUserProfileByUserId);

// Delete user profile by user_id (WITH authentication)
router.delete('/user/:userId', userprofileController.verifyToken, userprofileController.deleteUserProfileByUserId);

// Update user profile (WITH authentication)
router.put('/:id', userprofileController.verifyToken, validateUserProfile, userprofileController.updateUserProfile);

// Delete user profile (WITH authentication)
router.delete('/:id', userprofileController.verifyToken, userprofileController.deleteUserProfile);

module.exports = router;