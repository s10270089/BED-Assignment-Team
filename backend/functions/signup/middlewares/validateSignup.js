const Joi = require("joi");

const validateSignupSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  birthday: Joi.date().required(),
  age: Joi.number().integer().min(1).max(130).required()
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
