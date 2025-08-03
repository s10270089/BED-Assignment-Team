const Joi = require("joi");

// Validation schema for creating workout log
const createWorkoutLogSchema = Joi.object({
  user_id: Joi.number().integer().positive().required().messages({
    'number.base': 'User ID must be a number',
    'number.integer': 'User ID must be an integer',
    'number.positive': 'User ID must be positive',
    'any.required': 'User ID is required'
  }),
  exercise_type: Joi.string().min(2).max(100).required().messages({
    'string.base': 'Exercise type must be a string',
    'string.min': 'Exercise type must be at least 2 characters long',
    'string.max': 'Exercise type cannot exceed 100 characters',
    'any.required': 'Exercise type is required'
  }),
  exercise_name: Joi.string().min(2).max(100).required().messages({
    'string.base': 'Exercise name must be a string',
    'string.min': 'Exercise name must be at least 2 characters long',
    'string.max': 'Exercise name cannot exceed 100 characters',
    'any.required': 'Exercise name is required'
  }),
  sets: Joi.number().integer().min(0).max(50).optional().allow(null).messages({
    'number.base': 'Sets must be a number',
    'number.integer': 'Sets must be an integer',
    'number.min': 'Sets cannot be negative',
    'number.max': 'Sets cannot exceed 50'
  }),
  reps: Joi.number().integer().min(0).max(1000).optional().allow(null).messages({
    'number.base': 'Reps must be a number',
    'number.integer': 'Reps must be an integer',
    'number.min': 'Reps cannot be negative',
    'number.max': 'Reps cannot exceed 1000'
  }),
  duration_minutes: Joi.number().min(0).max(480).optional().allow(null).messages({
    'number.base': 'Duration must be a number',
    'number.min': 'Duration cannot be negative',
    'number.max': 'Duration cannot exceed 480 minutes (8 hours)'
  })
});

// Validation schema for user ID parameter
const userIdParamSchema = Joi.object({
  user_id: Joi.number().integer().positive().required().messages({
    'number.base': 'User ID must be a number',
    'number.integer': 'User ID must be an integer',
    'number.positive': 'User ID must be positive',
    'any.required': 'User ID is required'
  })
});

// Validation schema for log ID parameter
const logIdParamSchema = Joi.object({
  log_id: Joi.number().integer().positive().required().messages({
    'number.base': 'Log ID must be a number',
    'number.integer': 'Log ID must be an integer',
    'number.positive': 'Log ID must be positive',
    'any.required': 'Log ID is required'
  }),
  user_id: Joi.number().integer().positive().required().messages({
    'number.base': 'User ID must be a number',
    'number.integer': 'User ID must be an integer',
    'number.positive': 'User ID must be positive',
    'any.required': 'User ID is required'
  })
});

// Validation schema for date query parameter
const dateQuerySchema = Joi.object({
  date: Joi.date().iso().optional().messages({
    'date.base': 'Date must be a valid date',
    'date.iso': 'Date must be in ISO format (YYYY-MM-DD)'
  }),
  days: Joi.number().integer().min(1).max(365).optional().messages({
    'number.base': 'Days must be a number',
    'number.integer': 'Days must be an integer',
    'number.min': 'Days must be at least 1',
    'number.max': 'Days cannot exceed 365'
  })
});

// Middleware to validate workout log creation
const validateCreateWorkoutLog = (req, res, next) => {
  const { error } = createWorkoutLogSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  
  next();
};

// Middleware to validate user ID parameter
const validateUserIdParam = (req, res, next) => {
  // Convert string to number for validation
  req.params.user_id = parseInt(req.params.user_id);
  
  const { error } = userIdParamSchema.validate(req.params, { abortEarly: false });
  
  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID parameter',
      errors: errorMessages
    });
  }
  
  next();
};

// Middleware to validate log ID and user ID parameters
const validateLogIdParam = (req, res, next) => {
  // Convert strings to numbers for validation
  req.params.log_id = parseInt(req.params.log_id);
  req.params.user_id = parseInt(req.params.user_id);
  
  const { error } = logIdParamSchema.validate(req.params, { abortEarly: false });
  
  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Invalid parameters',
      errors: errorMessages
    });
  }
  
  next();
};

// Middleware to validate query parameters (date, days)
const validateQueryParams = (req, res, next) => {
  const { error } = dateQuerySchema.validate(req.query, { abortEarly: false });
  
  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Invalid query parameters',
      errors: errorMessages
    });
  }
  
  next();
};

// Middleware to validate and sanitize reflection text
const validateReflection = (req, res, next) => {
  const reflectionSchema = Joi.object({
    reflection: Joi.string().min(1).max(2000).required().messages({
      'string.base': 'Reflection must be a string',
      'string.min': 'Reflection cannot be empty',
      'string.max': 'Reflection cannot exceed 2000 characters',
      'any.required': 'Reflection is required'
    })
  });

  const paramSchema = Joi.object({
    user_id: Joi.number().integer().positive().required(),
    log_date: Joi.date().iso().required()
  });

  // Validate body
  const { error: bodyError } = reflectionSchema.validate(req.body, { abortEarly: false });
  if (bodyError) {
    const errorMessages = bodyError.details.map(detail => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }

  // Validate params
  const { error: paramError } = paramSchema.validate({
    user_id: parseInt(req.params.user_id),
    log_date: req.params.log_date
  }, { abortEarly: false });

  if (paramError) {
    const errorMessages = paramError.details.map(detail => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Invalid parameters',
      errors: errorMessages
    });
  }

  // Convert user_id to number
  req.params.user_id = parseInt(req.params.user_id);
  
  // Sanitize reflection text
  req.body.reflection = req.body.reflection.trim();
  
  next();
};

// Middleware to check if workout data is complete for logging
const validateWorkoutData = (req, res, next) => {
  const { sets, reps, duration_minutes } = req.body;
  
  // At least one of sets, reps, or duration should be provided for meaningful logging
  if (!sets && !reps && !duration_minutes) {
    return res.status(400).json({
      success: false,
      message: 'At least one workout metric (sets, reps, or duration) must be provided'
    });
  }
  
  next();
};

module.exports = {
  validateCreateWorkoutLog,
  validateUserIdParam,
  validateLogIdParam,
  validateQueryParams,
  validateReflection,
  validateWorkoutData
};