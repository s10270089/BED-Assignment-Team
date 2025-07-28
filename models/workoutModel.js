//workoutmodel.js
const sql = require("mssql");
const dbConfig = require("../dbConfig.js");
const OpenAI = require("openai"); // Use require instead of import

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // You need to set this environment variable
});

// Example function to use OpenAI
async function generateWorkoutSuggestion() {
    try {
        const response = await client.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "user",
                    content: "Make a workout plan that is low level activity and for strength training for seniors."
                }
            ]
        });
        return response.choices[0].message.content;
    } catch (error) {
        console.error("OpenAI API error:", error);
        throw error;
    }
}

// Get all workouts (default + user's personal workouts)
async function getAllForUser(userId) {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
        .input("user_id", sql.Int, userId)
        .query(`
            SELECT * FROM WorkoutPlans 
            WHERE is_default = 1 OR user_id = @user_id
            ORDER BY is_default DESC, plan_id DESC
        `);
    return result.recordset;
}

// Get only default workouts
async function getDefaultWorkouts() {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query(`
        SELECT * FROM WorkoutPlans WHERE is_default = 1
        ORDER BY plan_id
    `);
    return result.recordset;
}

// Get workout by ID
async function getById(id) {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
        .input("id", sql.Int, id)
        .query(`
            SELECT * FROM WorkoutPlans WHERE plan_id = @id
        `);
    return result.recordset[0];
}

// Create new personal workout plan
async function create(workoutData) {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
        .input("user_id", sql.Int, workoutData.user_id)
        .input("exercise_name", sql.NVarChar(100), workoutData.exercise_name)
        .input("frequency", sql.NVarChar(50), workoutData.frequency)
        .input("duration_minutes", sql.Int, workoutData.duration_minutes)
        .input("activity_level", sql.NVarChar(50), workoutData.activity_level)
        .input("reps", sql.Int, workoutData.reps)
        .input("sets", sql.Int, workoutData.sets)
        .input("image_url", sql.NVarChar(255), workoutData.image_url)
        .input("instructions", sql.NVarChar(sql.MAX), workoutData.instructions)
        .input("is_default", sql.Bit, 0) // Personal workout, not default
        .query(`
            INSERT INTO WorkoutPlans (user_id, exercise_name, frequency, duration_minutes, activity_level, reps, sets, image_url, instructions, is_default)
            VALUES (@user_id, @exercise_name, @frequency, @duration_minutes, @activity_level, @reps, @sets, @image_url, @instructions, @is_default);
            SELECT SCOPE_IDENTITY() AS plan_id;
        `);
    return result.recordset[0];
}

// Get only user's personal workouts
async function getByUserId(userId) {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
        .input("user_id", sql.Int, userId)
        .query(`
            SELECT * FROM WorkoutPlans 
            WHERE user_id = @user_id AND is_default = 0
            ORDER BY plan_id DESC
        `);
    return result.recordset;
}

// Update workout (only allow updating personal workouts, not defaults)
async function update(id, workoutData, userId) {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
        .input("plan_id", sql.Int, id)
        .input("user_id", sql.Int, userId)
        .input("exercise_name", sql.NVarChar(100), workoutData.exercise_name)
        .input("frequency", sql.NVarChar(50), workoutData.frequency)
        .input("duration_minutes", sql.Int, workoutData.duration_minutes)
        .input("activity_level", sql.NVarChar(50), workoutData.activity_level)
        .input("reps", sql.Int, workoutData.reps)
        .input("sets", sql.Int, workoutData.sets)
        .input("image_url", sql.NVarChar(255), workoutData.image_url)
        .input("instructions", sql.NVarChar(sql.MAX), workoutData.instructions)
        .query(`
            UPDATE WorkoutPlans 
            SET exercise_name = @exercise_name, 
                frequency = @frequency, 
                duration_minutes = @duration_minutes, 
                activity_level = @activity_level,
                reps = @reps,
                sets = @sets,
                image_url = @image_url,
                instructions = @instructions
            WHERE plan_id = @plan_id AND user_id = @user_id AND is_default = 0
        `);
    return result.rowsAffected[0] > 0;
}

// Delete workout (only allow deleting personal workouts, not defaults)
async function deleteById(id, userId) {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
        .input("plan_id", sql.Int, id)
        .input("user_id", sql.Int, userId)
        .query(`
            DELETE FROM WorkoutPlans 
            WHERE plan_id = @plan_id AND user_id = @user_id AND is_default = 0
        `);
    return result.rowsAffected[0] > 0;
}

module.exports = {
    getAllForUser,
    getDefaultWorkouts,
    getByUserId,
    getById,
    create,
    update,
    deleteById,
    generateWorkoutSuggestion
};
