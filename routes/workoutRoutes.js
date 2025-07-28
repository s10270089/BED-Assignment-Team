const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const { validateWorkout, validateWorkoutUpdate } = require('../middlewares/validateWorkout');

// Get default workouts (everyone can see these)
router.get('/default', workoutController.getDefaultWorkouts);

// Get personal workouts for current user
router.get('/personal', workoutController.getUserWorkouts);

// Get all workouts for a user (default + personal)
router.get('/all', workoutController.getAllWorkoutsForUser);

// Get workout by ID
router.get('/:id', workoutController.getWorkoutById);

// Create new personal workout
router.post('/', validateWorkout, workoutController.createWorkout);

// Update personal workout
router.put('/:id', validateWorkoutUpdate, workoutController.updateWorkout);

// Delete personal workout
router.delete('/:id', workoutController.deleteWorkout);

// Generate AI workout suggestion
router.get('/generate', workoutController.generateWorkoutSuggestion);

module.exports = router;