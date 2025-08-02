const Joi = require("joi");

const validateSignupSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  birthday: Joi.date().required(),
  weight: Joi.string().pattern(/^\d+(kg|lbs)$/i).required().messages({
  "string.pattern.base": "Weight must be in kg or lbs (e.g. 60kg)"
}),
height: Joi.string().pattern(/^\d+(cm|ft)$/i).required().messages({
  "string.pattern.base": "Height must be in cm or ft (e.g. 170cm)"
})
});

module.exports = (req, res, next) => {
  const { error } = validateSignupSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      errors: error.details.map((d) => d.message),
    });
  }
  next();
};
