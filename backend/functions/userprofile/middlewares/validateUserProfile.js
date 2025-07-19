// validateUserProfile.js
const Joi = require("joi");

const schema = Joi.object({
  user_id: Joi.number().integer().positive().required(),
  name: Joi.string().max(100).optional(),
  birthday: Joi.date().less('now').iso().optional(),
  activity_level: Joi.string().valid('low', 'medium', 'high').required(),
  profile_photo_url: Joi.string().uri().allow('').optional(),
});


module.exports = (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      details: error.details.map(e => e.message),
    });
  }

  next();
};
