const sql = require('mssql');
const dbConfig = require('../dbConfig');

// WorkoutTypes functions
async function getAllWorkoutTypes() {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM WorkoutTypes`;
    const request = connection.request();
    const result = await request.query(sqlQuery);
    connection.close();
    return result.recordset;
}

async function getWorkoutTypeByExerciseType(exercise_type) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM WorkoutTypes WHERE exercise_type = @exercise_type`;
    const request = connection.request();
    request.input('exercise_type', exercise_type);
    const result = await request.query(sqlQuery);
    connection.close();
    return result.recordset[0] || null;
}

async function getWorkoutTypeByExerciseName(exercise_name) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM WorkoutTypes WHERE exercise_name = @exercise_name`;
    const request = connection.request();
    request.input('exercise_name', exercise_name);
    const result = await request.query(sqlQuery);
    connection.close();
    return result.recordset[0] || null;
}

async function getWorkoutTypesByActivityLevel(activity_level) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM WorkoutTypes WHERE activity_level = @activity_level`;
    const request = connection.request();
    request.input('activity_level', activity_level);
    const result = await request.query(sqlQuery);
    connection.close();
    return result.recordset;
}

// WorkoutPlans functions
async function createWorkoutPlan(user_id, exercise_name) {
    // First check if user already has this workout in their plan
    const existingPlan = await checkExistingWorkoutPlan(user_id, exercise_name);
    if (existingPlan) {
        throw new Error('Workout already exists in your plan');
    }

    const workoutType = await getWorkoutTypeByExerciseName(exercise_name);
    if (!workoutType) {
        throw new Error('Workout not found');
    }

    const connection = await sql.connect(dbConfig);
    const sqlQuery = `
        INSERT INTO WorkoutPlans (user_id, exercise_type, exercise_name, frequency, activity_level, image_url, reps, sets, duration_minutes, instructions)
        VALUES (@user_id, @exercise_type, @exercise_name, @frequency, @activity_level, @image_url, @reps, @sets, @duration_minutes, @instructions)
    `;
    const request = connection.request();
    request.input('user_id', user_id);
    request.input('exercise_type', workoutType.exercise_type);
    request.input('exercise_name', workoutType.exercise_name);
    request.input('frequency', workoutType.frequency);
    request.input('activity_level', workoutType.activity_level);
    request.input('image_url', workoutType.image_url);
    request.input('reps', workoutType.reps);
    request.input('sets', workoutType.sets);
    request.input('duration_minutes', workoutType.duration_minutes);
    request.input('instructions', workoutType.instructions);
    
    await request.query(sqlQuery);
    connection.close();
    return workoutType;
}

// Add helper function to check for existing workout plans
async function checkExistingWorkoutPlan(user_id, exercise_name) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT COUNT(*) as count FROM WorkoutPlans WHERE user_id = @user_id AND exercise_name = @exercise_name`;
    const request = connection.request();
    request.input('user_id', user_id);
    request.input('exercise_name', exercise_name);
    const result = await request.query(sqlQuery);
    connection.close();
    return result.recordset[0].count > 0;
}

async function getUserWorkoutPlans(user_id) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM WorkoutPlans WHERE user_id = @user_id`;
    const request = connection.request();
    request.input('user_id', user_id);
    const result = await request.query(sqlQuery);
    connection.close();
    return result.recordset;
}

async function removeWorkoutFromPlan(user_id, exercise_name) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `DELETE FROM WorkoutPlans WHERE user_id = @user_id AND exercise_name = @exercise_name`;
    const request = connection.request();
    request.input('user_id', user_id);
    request.input('exercise_name', exercise_name);
    const result = await request.query(sqlQuery);
    connection.close();
    return result.rowsAffected[0] > 0;
}

async function updateWorkoutPlan(user_id, exercise_name, updates) {
    const connection = await sql.connect(dbConfig);
    let sqlQuery = `UPDATE WorkoutPlans SET `;
    const updateFields = [];
    const request = connection.request();
    
    request.input('user_id', user_id);
    request.input('exercise_name', exercise_name);

    if (updates.reps !== undefined) {
        updateFields.push('reps = @reps');
        request.input('reps', updates.reps);
    }
    if (updates.sets !== undefined) {
        updateFields.push('sets = @sets');
        request.input('sets', updates.sets);
    }
    if (updates.duration_minutes !== undefined) {
        updateFields.push('duration_minutes = @duration_minutes');
        request.input('duration_minutes', updates.duration_minutes);
    }
    if (updates.frequency !== undefined) {
        updateFields.push('frequency = @frequency');
        request.input('frequency', updates.frequency);
    }

    sqlQuery += updateFields.join(', ');
    sqlQuery += ` WHERE user_id = @user_id AND exercise_name = @exercise_name`;
    
    const result = await request.query(sqlQuery);
    connection.close();
    return result.rowsAffected[0] > 0;
}

module.exports = {
    getAllWorkoutTypes,
    getWorkoutTypeByExerciseType, // Keep for backwards compatibility
    getWorkoutTypeByExerciseName, // New function
    getWorkoutTypesByActivityLevel,
    createWorkoutPlan,
    getUserWorkoutPlans,
    removeWorkoutFromPlan,
    updateWorkoutPlan,
    checkExistingWorkoutPlan
};