const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const { validateWorkoutPlan, validateWorkoutUpdate, validateWorkoutParams } = require('../middlewares/validateWorkout');

// WorkoutTypes routes
// Get all available workout types
router.get('/types', workoutController.getAllWorkoutTypesController);

// Get workout types by activity level
router.get('/types/activity/:activity_level', validateWorkoutParams, workoutController.getWorkoutTypesByActivityLevelController);

// Get specific workout type by exercise type
router.get('/types/:exercise_type', validateWorkoutParams, workoutController.getWorkoutTypeByExerciseTypeController);

// WorkoutPlans routes
// Create workout plan (add workout to user's plan)
router.post('/plan', validateWorkoutPlan, workoutController.createWorkoutPlanController);

// Get user's workout plans
router.get('/plan/:user_id', validateWorkoutParams, workoutController.getUserWorkoutPlansController);

// Update workout in user's plan
router.put('/plan/:user_id/:exercise_name', validateWorkoutUpdate, workoutController.updateWorkoutPlanController);

// Remove workout from user's plan
router.delete('/plan/:user_id/:exercise_name', validateWorkoutParams, workoutController.removeWorkoutFromPlanController);

module.exports = router;