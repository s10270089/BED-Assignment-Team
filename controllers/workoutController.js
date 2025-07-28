const Workout = require("../models/workoutModel");

// Get only default workouts
const getDefaultWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.getDefaultWorkouts();
        res.json(workouts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving default workout plans" });
    }
};

// Get only user's personal workouts
const getUserWorkouts = async (req, res) => {
    const userId = req.user?.user_id || 1; // You'll need proper user session management
    
    try {
        const workouts = await Workout.getByUserId(userId);
        res.json(workouts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving user workout plans" });
    }
};

// Get all workouts for a user (default + personal)
const getAllWorkoutsForUser = async (req, res) => {
    const userId = req.user?.user_id || 1;
    
    try {
        const workouts = await Workout.getAllForUser(userId);
        res.json(workouts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving workout plans" });
    }
};

// Get workout by ID
const getWorkoutById = async (req, res) => {
    const id = parseInt(req.params.id);
    
    try {
        const workout = await Workout.getById(id);
        if (!workout) {
            return res.status(404).json({ message: "Workout plan not found" });
        }
        res.json(workout);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving workout plan" });
    }
};

// Create new personal workout plan
const createWorkout = async (req, res) => {
    const { exercise_name, activity_level, reps, sets, duration_minutes, image_url, instructions } = req.body;
    const userId = req.user?.user_id || 1; // Get from session/token
    
    try {
        const newWorkout = await Workout.create({
            user_id: userId,
            exercise_name,
            activity_level,
            reps,
            sets,
            duration_minutes,
            image_url,
            instructions
        });
        
        res.status(201).json(newWorkout);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating workout plan" });
    }
};

// Update personal workout plan
const updateWorkout = async (req, res) => {
    const id = parseInt(req.params.id);
    const { exercise_name, frequency, duration_minutes, activity_level, reps, sets, image_url, instructions } = req.body;
    const userId = req.user?.user_id || 1;
    
    try {
        const updated = await Workout.update(id, {
            exercise_name,
            activity_level,
            reps,
            sets,
            duration_minutes,
            image_url,
            instructions
        }, userId);
        
        if (!updated) {
            return res.status(404).json({ message: "Workout plan not found or not authorized" });
        }
        
        res.json({ message: "Workout plan updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating workout plan" });
    }
};

// Delete personal workout plan
const deleteWorkout = async (req, res) => {
    const id = parseInt(req.params.id);
    const userId = req.user?.user_id || 1;
    
    try {
        const deleted = await Workout.deleteById(id, userId);
        
        if (!deleted) {
            return res.status(404).json({ message: "Workout plan not found or not authorized" });
        }
        
        res.json({ message: "Workout plan deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting workout plan" });
    }
};

// Generate AI workout suggestion
const generateWorkoutSuggestion = async (req, res) => {
    try {
        const suggestion = await Workout.generateWorkoutSuggestion();
        res.json({ suggestion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error generating workout suggestion" });
    }
};

module.exports = {
    getDefaultWorkouts,
    getUserWorkouts,
    getAllWorkoutsForUser,
    getWorkoutById,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    generateWorkoutSuggestion
};