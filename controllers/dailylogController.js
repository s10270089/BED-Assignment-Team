const dailylogModel = require('../models/dailylogModel');

// Create or update workout log
async function createWorkoutLogController(req, res) {
    try {
        const { user_id, exercise_type, exercise_name, sets, reps, duration_minutes } = req.body;
        
        console.log('Received workout log request:', req.body); // Debug log
        
        if (!user_id || !exercise_type || !exercise_name) {
            return res.status(400).json({
                success: false,
                message: 'User ID, exercise type, and exercise name are required'
            });
        }

        const result = await dailylogModel.createOrUpdateWorkoutLog(user_id, exercise_type, exercise_name, sets, reps, duration_minutes);
        
        if (result) {
            res.status(201).json({
                success: true,
                message: 'Workout logged successfully'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to log workout'
            });
        }
    } catch (error) {
        console.error('Error creating workout log:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

// Update reflection for a log entry
async function updateReflectionController(req, res) {
    try {
        const { user_id, log_date } = req.params;
        const { reflection } = req.body;
        
        if (!user_id || !log_date || reflection === undefined) {
            return res.status(400).json({
                success: false,
                message: 'User ID, log date, and reflection are required'
            });
        }

        const result = await dailylogModel.updateLogReflection(user_id, log_date, reflection);
        
        if (result) {
            res.status(200).json({
                success: true,
                message: 'Reflection updated successfully'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Log entry not found for this date. Please create a workout log first.'
            });
        }
    } catch (error) {
        console.error('Error updating reflection:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

// Get user's workout logs
async function getUserWorkoutLogsController(req, res) {
    try {
        const { user_id } = req.params;
        const { date } = req.query;
        
        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const logs = await dailylogModel.getUserWorkoutLogs(user_id, date);
        
        res.status(200).json({
            success: true,
            message: 'Workout logs retrieved successfully',
            data: logs
        });
    } catch (error) {
        console.error('Error getting workout logs:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

// Get today's workout logs for a user
async function getTodayWorkoutLogsController(req, res) {
    try {
        const { user_id } = req.params;
        
        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const logs = await dailylogModel.getTodayWorkoutLogs(user_id);
        
        res.status(200).json({
            success: true,
            message: 'Today\'s workout logs retrieved successfully',
            data: logs
        });
    } catch (error) {
        console.error('Error getting today\'s workout logs:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

// Get today's workout count
async function getTodayWorkoutCountController(req, res) {
    try {
        const { user_id } = req.params;
        
        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const count = await dailylogModel.getTodayWorkoutCount(user_id);
        
        res.status(200).json({
            success: true,
            message: 'Today\'s workout count retrieved successfully',
            data: { count }
        });
    } catch (error) {
        console.error('Error getting today\'s workout count:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

// Get workout statistics for a user
async function getWorkoutStatsController(req, res) {
    try {
        const { user_id } = req.params;
        const { days } = req.query;
        
        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const dayCount = days ? parseInt(days) : 7;
        const stats = await dailylogModel.getWorkoutStats(user_id, dayCount);
        
        res.status(200).json({
            success: true,
            message: 'Workout statistics retrieved successfully',
            data: stats
        });
    } catch (error) {
        console.error('Error getting workout statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

// Delete a workout log entry
async function deleteWorkoutLogController(req, res) {
    try {
        const { log_id, user_id } = req.params;
        
        if (!log_id || !user_id) {
            return res.status(400).json({
                success: false,
                message: 'Log ID and User ID are required'
            });
        }

        const result = await dailylogModel.deleteWorkoutLog(log_id, user_id);
        
        if (result) {
            res.status(200).json({
                success: true,
                message: 'Workout log deleted successfully'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Workout log not found or unauthorized'
            });
        }
    } catch (error) {
        console.error('Error deleting workout log:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

module.exports = {
    createWorkoutLogController,
    updateReflectionController, // New function
    getUserWorkoutLogsController,
    getTodayWorkoutLogsController,
    getTodayWorkoutCountController,
    getWorkoutStatsController,
    deleteWorkoutLogController
};