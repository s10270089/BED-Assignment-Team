const sql = require('mssql');
const dbConfig = require('../dbConfig');

// Create or update daily log entry for completed workout
async function createOrUpdateWorkoutLog(user_id, exercise_type, exercise_name, sets, reps, duration_minutes) {
    const connection = await sql.connect(dbConfig);
    const today = new Date().toISOString().split('T')[0];
    
    try {
        // Check if there's already a log entry for today
        const checkQuery = `
            SELECT log_id, exercises 
            FROM DailyLogs 
            WHERE user_id = @user_id AND log_date = @today
        `;
        const checkRequest = connection.request();
        checkRequest.input('user_id', user_id);
        checkRequest.input('today', today);
        const existingLog = await checkRequest.query(checkQuery);
        
        // Create workout description for exercises column
        const workoutDescription = `${exercise_name} (${exercise_type}) - ${sets || 0} sets, ${reps || 0} reps${duration_minutes ? `, ${duration_minutes} minutes` : ''}`;
        
        if (existingLog.recordset.length > 0) {
            // Update existing log by appending new workout to exercises column
            const currentExercises = existingLog.recordset[0].exercises || '';
            const updatedExercises = currentExercises 
                ? `${currentExercises}; Completed ${workoutDescription}`
                : `Completed ${workoutDescription}`;
            
            const updateQuery = `
                UPDATE DailyLogs 
                SET exercises = @exercises 
                WHERE log_id = @log_id
            `;
            const updateRequest = connection.request();
            updateRequest.input('exercises', updatedExercises);
            updateRequest.input('log_id', existingLog.recordset[0].log_id);
            
            const result = await updateRequest.query(updateQuery);
            connection.close();
            return result.rowsAffected[0] > 0;
        } else {
            // Create new log entry for today
            const exercises = `Completed ${workoutDescription}`;
            
            const insertQuery = `
                INSERT INTO DailyLogs (user_id, exercises, reflection, log_date)
                VALUES (@user_id, @exercises, @reflection, @log_date)
            `;
            const insertRequest = connection.request();
            insertRequest.input('user_id', user_id);
            insertRequest.input('exercises', exercises);
            insertRequest.input('reflection', ''); // Empty reflection initially
            insertRequest.input('log_date', today);
            
            const result = await insertRequest.query(insertQuery);
            connection.close();
            return result.rowsAffected[0] > 0;
        }
    } catch (error) {
        connection.close();
        throw error;
    }
}

// Get user's workout logs by date
async function getUserWorkoutLogs(user_id, date = null) {
    const connection = await sql.connect(dbConfig);
    let sqlQuery = `SELECT * FROM DailyLogs WHERE user_id = @user_id`;
    
    if (date) {
        sqlQuery += ` AND log_date = @date`;
    }
    
    sqlQuery += ` ORDER BY log_date DESC, log_id DESC`;
    
    const request = connection.request();
    request.input('user_id', user_id);
    if (date) {
        request.input('date', date);
    }
    
    const result = await request.query(sqlQuery);
    connection.close();
    return result.recordset;
}

// Get today's workout logs for a user
async function getTodayWorkoutLogs(user_id) {
    const today = new Date().toISOString().split('T')[0];
    return await getUserWorkoutLogs(user_id, today);
}

// Get workout count for today (count individual workouts within the exercises column)
async function getTodayWorkoutCount(user_id) {
    const connection = await sql.connect(dbConfig);
    const today = new Date().toISOString().split('T')[0];
    
    const sqlQuery = `
        SELECT exercises 
        FROM DailyLogs 
        WHERE user_id = @user_id 
        AND log_date = @today
    `;
    
    const request = connection.request();
    request.input('user_id', user_id);
    request.input('today', today);
    
    const result = await request.query(sqlQuery);
    connection.close();
    
    if (result.recordset.length === 0) {
        return 0;
    }
    
    // Count occurrences of "Completed" in the exercises column to get workout count
    const exercises = result.recordset[0].exercises || '';
    const completedCount = (exercises.match(/Completed/g) || []).length;
    return completedCount;
}

// Get workout statistics for a user (last N days)
async function getWorkoutStats(user_id, days = 7) {
    const connection = await sql.connect(dbConfig);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0];
    
    const sqlQuery = `
        SELECT 
            exercises,
            log_date
        FROM DailyLogs 
        WHERE user_id = @user_id 
        AND log_date >= @cutoff_date
    `;
    
    const request = connection.request();
    request.input('user_id', user_id);
    request.input('cutoff_date', cutoffDateStr);
    
    const result = await request.query(sqlQuery);
    connection.close();
    
    let totalWorkouts = 0;
    let activeDays = 0;
    
    result.recordset.forEach(log => {
        const exercises = log.exercises || '';
        const completedCount = (exercises.match(/Completed/g) || []).length;
        if (completedCount > 0) {
            totalWorkouts += completedCount;
            activeDays++;
        }
    });
    
    return {
        total_workouts: totalWorkouts,
        active_days: activeDays
    };
}

// Add or update reflection for a specific log
async function updateLogReflection(user_id, log_date, reflection) {
    const connection = await sql.connect(dbConfig);
    
    try {
        const updateQuery = `
            UPDATE DailyLogs 
            SET reflection = @reflection 
            WHERE user_id = @user_id AND log_date = @log_date
        `;
        const request = connection.request();
        request.input('user_id', user_id);
        request.input('log_date', log_date);
        request.input('reflection', reflection);
        
        const result = await request.query(updateQuery);
        connection.close();
        return result.rowsAffected[0] > 0;
    } catch (error) {
        connection.close();
        throw error;
    }
}

// Delete a workout log entry
async function deleteWorkoutLog(log_id, user_id) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `DELETE FROM DailyLogs WHERE log_id = @log_id AND user_id = @user_id`;
    const request = connection.request();
    request.input('log_id', log_id);
    request.input('user_id', user_id);
    const result = await request.query(sqlQuery);
    connection.close();
    return result.rowsAffected[0] > 0;
}

module.exports = {
    createOrUpdateWorkoutLog,
    getUserWorkoutLogs,
    getTodayWorkoutLogs,
    getTodayWorkoutCount,
    getWorkoutStats,
    updateLogReflection, // New function
    deleteWorkoutLog
};