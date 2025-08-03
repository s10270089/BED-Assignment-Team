const validateWorkout = (req, res, next) => {
    const { exercise_name, duration_minutes, activity_level, reps, sets, image_url, instructions } = req.body;
    
    // Required fields
    if (!exercise_name || exercise_name.trim() === '') {
        return res.status(400).json({ message: "Exercise name is required and cannot be empty" });
    }
    

    if (!duration_minutes || duration_minutes === null || duration_minutes === undefined) {
        return res.status(400).json({ message: "Duration is required and cannot be empty" });
    }
    
    if (!activity_level || activity_level.trim() === '') {
        return res.status(400).json({ message: "Activity level is required and cannot be empty" });
    }
    
    // Validate data types and ranges
    if (typeof exercise_name !== 'string' || exercise_name.length > 100) {
        return res.status(400).json({ message: "Exercise name must be a string and cannot exceed 100 characters" });
    }
    
    const durationNum = parseInt(duration_minutes);
    if (isNaN(durationNum) || durationNum < 5 || durationNum > 120) {
        return res.status(400).json({ message: "Duration must be a number between 5 and 120 minutes" });
    }
    
    const validActivityLevels = ['beginner', 'intermediate', 'advanced'];
    if (!validActivityLevels.includes(activity_level.toLowerCase())) {
        return res.status(400).json({ message: "Activity level must be: beginner, intermediate, or advanced" });
    }
    
    // Optional field validation
    if (reps && (isNaN(parseInt(reps)) || parseInt(reps) < 1 || parseInt(reps) > 50)) {
        return res.status(400).json({ message: "Reps must be a number between 1 and 50" });
    }
    
    if (sets && (isNaN(parseInt(sets)) || parseInt(sets) < 1 || parseInt(sets) > 10)) {
        return res.status(400).json({ message: "Sets must be a number between 1 and 10" });
    }
    
    if (image_url && (typeof image_url !== 'string' || image_url.length > 255)) {
        return res.status(400).json({ message: "Image URL must be a string and cannot exceed 255 characters" });
    }
    
    if (instructions && (typeof instructions !== 'string' || instructions.length > 1000)) {
        return res.status(400).json({ message: "Instructions must be a string and cannot exceed 1000 characters" });
    }
    
    // Set default frequency and sanitize data
    req.body.exercise_name = exercise_name.trim();
    req.body.duration_minutes = durationNum;
    req.body.activity_level = activity_level.toLowerCase().trim();
    req.body.reps = reps ? parseInt(reps) : null;
    req.body.sets = sets ? parseInt(sets) : null;
    req.body.image_url = image_url ? image_url.trim() : null;
    req.body.instructions = instructions ? instructions.trim() : null;
    
    next();
};

// Validation for creating workout plans (only needs user_id and exercise_type)
const validateWorkoutPlan = (req, res, next) => {
    const { user_id, exercise_name } = req.body;
    
    // Required fields
    if (!user_id || user_id === null || user_id === undefined) {
        return res.status(400).json({ 
            success: false,
            message: "User ID is required" 
        });
    }
    
    if (!exercise_name || exercise_name.trim() === '') {
        return res.status(400).json({ 
            success: false,
            message: "Exercise name is required and cannot be empty" 
        });
    }
    
    // Validate data types
    if (isNaN(parseInt(user_id)) || parseInt(user_id) < 1) {
        return res.status(400).json({ 
            success: false,
            message: "User ID must be a positive number" 
        });
    }
    
    if (typeof exercise_name !== 'string' || exercise_name.length > 100) {
        return res.status(400).json({ 
            success: false,
            message: "Exercise name must be a string and cannot exceed 100 characters" 
        });
    }
    
    // Sanitize data
    req.body.user_id = parseInt(user_id);
    req.body.exercise_name = exercise_name.trim();
    
    next();
};

// Validation for updating workout plans
const validateWorkoutUpdate = (req, res, next) => {
    const { reps, sets, duration_minutes, frequency } = req.body;
    const { user_id, exercise_name } = req.params;
    
    // Validate URL parameters
    if (!user_id || isNaN(parseInt(user_id)) || parseInt(user_id) < 1) {
        return res.status(400).json({ 
            success: false,
            message: "Valid User ID is required in URL" 
        });
    }
    
    if (!exercise_name || exercise_name.trim() === '') {  // Changed from exercise_type to exercise_name
        return res.status(400).json({ 
            success: false,
            message: "Exercise name is required in URL"  // Updated message
        });
    }
    
    // Check if at least one field is being updated
    const allowedFields = ['reps', 'sets', 'duration_minutes', 'frequency'];
    const hasValidUpdate = allowedFields.some(field => req.body[field] !== undefined);
    
    if (!hasValidUpdate) {
        return res.status(400).json({ 
            success: false,
            message: "At least one field (reps, sets, duration_minutes, frequency) must be provided for update" 
        });
    }
    
    // Validate optional fields if provided
    if (reps !== undefined) {
        if (isNaN(parseInt(reps)) || parseInt(reps) < 1 || parseInt(reps) > 50) {
            return res.status(400).json({ 
                success: false,
                message: "Reps must be a number between 1 and 50" 
            });
        }
        req.body.reps = parseInt(reps);
    }
    
    if (sets !== undefined) {
        if (isNaN(parseInt(sets)) || parseInt(sets) < 1 || parseInt(sets) > 10) {
            return res.status(400).json({ 
                success: false,
                message: "Sets must be a number between 1 and 10" 
            });
        }
        req.body.sets = parseInt(sets);
    }
    
    if (duration_minutes !== undefined) {
        if (isNaN(parseInt(duration_minutes)) || parseInt(duration_minutes) < 5 || parseInt(duration_minutes) > 180) {
            return res.status(400).json({ 
                success: false,
                message: "Duration must be a number between 5 and 180 minutes" 
            });
        }
        req.body.duration_minutes = parseInt(duration_minutes);
    }
    
    if (frequency !== undefined) {
        if (typeof frequency !== 'string' || frequency.trim() === '' || frequency.length > 100) {
            return res.status(400).json({ 
                success: false,
                message: "Frequency must be a non-empty string and cannot exceed 100 characters" 
            });
        }
        req.body.frequency = frequency.trim();
    }
    
    next();
};

// Validation for URL parameters (user_id, exercise_name, activity_level)
const validateWorkoutParams = (req, res, next) => {
    const { user_id, exercise_type, exercise_name, activity_level } = req.params;  // Added exercise_name
    
    if (user_id !== undefined) {
        if (isNaN(parseInt(user_id)) || parseInt(user_id) < 1) {
            return res.status(400).json({ 
                success: false,
                message: "Valid User ID is required" 
            });
        }
    }
    
    // Keep exercise_type validation for backward compatibility (browse workouts)
    if (exercise_type !== undefined) {
        if (typeof exercise_type !== 'string' || exercise_type.trim() === '') {
            return res.status(400).json({ 
                success: false,
                message: "Valid exercise type is required" 
            });
        }
    }
    
    // Add exercise_name validation for workout plans
    if (exercise_name !== undefined) {
        if (typeof exercise_name !== 'string' || exercise_name.trim() === '') {
            return res.status(400).json({ 
                success: false,
                message: "Valid exercise name is required" 
            });
        }
    }
    
    if (activity_level !== undefined) {
        const validActivityLevels = ['beginner', 'intermediate', 'advanced'];
        if (!validActivityLevels.includes(activity_level.toLowerCase())) {
            return res.status(400).json({ 
                success: false,
                message: "Activity level must be: beginner, intermediate, or advanced" 
            });
        }
    }
    
    next();
};

module.exports = {
    validateWorkout,
    validateWorkoutPlan,
    validateWorkoutUpdate,
    validateWorkoutParams
};