const express = require('express');
const router = express.Router();
const userprofileController = require('../controller/userprofileController');
const validateUserProfile = require('../middleware/validateUserProfile');

router.get('/', userprofileController.getAllUserProfiles);

// Get exercise recommendations (must come before /:id routes to avoid conflicts)
router.get('/recommendations/exercise', userprofileController.getExerciseRecommendations);

// Get user profile by ID
router.get('/:id', userprofileController.getUserProfileById);

// Get user profile with recommendations
router.get('/:id/recommendations', userprofileController.getUserProfileWithRecommendations);

// Create user profile
router.post('/', validateUserProfile, userprofileController.createUserProfile);

// Update user profile
router.put('/:id', validateUserProfile, userprofileController.updateUserProfile);

// Delete user profile
router.delete('/:id', userprofileController.deleteUserProfile);

module.exports = router;