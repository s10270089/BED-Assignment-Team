const workoutModel = require('../models/workoutModel');

// WorkoutTypes Controllers
async function getAllWorkoutTypesController(req, res) {
    try {
        const workoutTypes = await workoutModel.getAllWorkoutTypes();
        res.status(200).json({
            success: true,
            message: 'Workout types retrieved successfully',
            data: workoutTypes
        });
    } catch (error) {
        console.error('Error fetching workout types:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

async function getWorkoutTypeByExerciseTypeController(req, res) {
    try {
        const { exercise_type } = req.params;
        const workoutType = await workoutModel.getWorkoutTypeByExerciseType(exercise_type);

        if (!workoutType) {
            return res.status(404).json({
                success: false,
                message: 'Workout type not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Workout type retrieved successfully',
            data: workoutType
        });
    } catch (error) {
        console.error('Error fetching workout type:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

async function getWorkoutTypesByActivityLevelController(req, res) {
    try {
        const { activity_level } = req.params;
        const workoutTypes = await workoutModel.getWorkoutTypesByActivityLevel(activity_level);

        res.status(200).json({
            success: true,
            message: 'Workout types retrieved successfully',
            data: workoutTypes
        });
    } catch (error) {
        console.error('Error fetching workout types by activity level:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

// WorkoutPlans Controllers
async function createWorkoutPlanController(req, res) {
    try {
        const { user_id, exercise_name } = req.body;
        
        if (!user_id || !exercise_name) {
            return res.status(400).json({
                success: false,
                message: 'User ID and exercise name are required'
            });
        }

        const workoutPlan = await workoutModel.createWorkoutPlan(user_id, exercise_name);
        
        res.status(201).json({
            success: true,
            message: 'Workout plan created successfully',
            data: workoutPlan
        });
    } catch (error) {
        console.error('Error creating workout plan:', error);
        if (error.message === 'Workout not found' || error.message === 'Workout already exists in your plan') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

async function getUserWorkoutPlansController(req, res) {
    try {
        const { user_id } = req.params;
        const workoutPlans = await workoutModel.getUserWorkoutPlans(user_id);

        res.status(200).json({
            success: true,
            message: 'User workout plans retrieved successfully',
            data: workoutPlans
        });
    } catch (error) {
        console.error('Error fetching user workout plans:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

async function removeWorkoutFromPlanController(req, res) {
    try {
        const { user_id, exercise_name } = req.params;
        const isRemoved = await workoutModel.removeWorkoutFromPlan(user_id, exercise_name);

        if (!isRemoved) {
            return res.status(404).json({
                success: false,
                message: 'Workout not found in user plan'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Workout removed from plan successfully'
        });
    } catch (error) {
        console.error('Error removing workout from plan:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}


async function updateWorkoutPlanController(req, res) {
    try {
        const { user_id, exercise_name } = req.params;
        const updates = req.body;
        
        const allowedFields = ['reps', 'sets', 'duration_minutes', 'frequency'];
        const hasValidUpdate = allowedFields.some(field => updates[field] !== undefined);
        
        if (!hasValidUpdate) {
            return res.status(400).json({
                success: false,
                message: 'At least one field (reps, sets, duration_minutes, frequency) must be provided for update'
            });
        }

        const isUpdated = await workoutModel.updateWorkoutPlan(user_id, exercise_name, updates);

        if (!isUpdated) {
            return res.status(404).json({
                success: false,
                message: 'Workout not found in user plan'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Workout plan updated successfully'
        });
    } catch (error) {
        console.error('Error updating workout plan:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

module.exports = {
    getAllWorkoutTypesController,
    getWorkoutTypeByExerciseTypeController,
    getWorkoutTypesByActivityLevelController,
    createWorkoutPlanController,
    getUserWorkoutPlansController,
    removeWorkoutFromPlanController,
    updateWorkoutPlanController
};