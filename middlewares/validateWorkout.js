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

module.exports = {
    validateWorkout,
    validateWorkoutUpdate: validateWorkout
};