const express = require('express');
const router = express.Router();

const dailylogController = require('../controllers/dailylogController');
const { 
    validateCreateWorkoutLog, 
    validateUserIdParam, 
    validateLogIdParam,
    validateQueryParams,
    validateWorkoutData,
    validateReflection
} = require('../middlewares/validateDailyLog');

// POST /dailylogs/workout - Create a workout log entry
router.post('/workout', 
    validateCreateWorkoutLog, 
    validateWorkoutData, 
    dailylogController.createWorkoutLogController
);

// PUT /dailylogs/reflection/:user_id/:log_date - Update reflection for a log entry
router.put('/reflection/:user_id/:log_date', 
    validateReflection,
    dailylogController.updateReflectionController
);

// GET /dailylogs/:user_id - Get all workout logs for a user (with optional date filter)
router.get('/:user_id', 
    validateUserIdParam, 
    validateQueryParams, 
    dailylogController.getUserWorkoutLogsController
);

// GET /dailylogs/today/:user_id - Get today's workout logs for a user
router.get('/today/:user_id', 
    validateUserIdParam, 
    dailylogController.getTodayWorkoutLogsController
);

// GET /dailylogs/today-count/:user_id - Get today's workout count for a user
router.get('/today-count/:user_id', 
    validateUserIdParam, 
    dailylogController.getTodayWorkoutCountController
);

// GET /dailylogs/stats/:user_id - Get workout statistics for a user
router.get('/stats/:user_id', 
    validateUserIdParam, 
    validateQueryParams, 
    dailylogController.getWorkoutStatsController
);

// DELETE /dailylogs/:log_id/:user_id - Delete a specific workout log entry
router.delete('/:log_id/:user_id', 
    validateLogIdParam, 
    dailylogController.deleteWorkoutLogController
);

module.exports = router;