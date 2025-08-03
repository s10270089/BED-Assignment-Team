const Joi = require("joi");

// Step 1: Basic info
const basicSignupSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

// Step 2: Additional info
const additionalSignupSchema = Joi.object({
  birthday: Joi.date().required(),
  weight: Joi.number().positive().required().messages({
    "number.base": "Weight must be a number",
    "number.positive": "Weight must be a positive value"
  }),
  height: Joi.number().positive().required().messages({
    "number.base": "Height must be a number",
    "number.positive": "Height must be a positive value"
  }),
  gender: Joi.string().valid('male', 'female', 'other').required().messages({
    "any.only": "Gender must be 'male', 'female', or 'other'"
  })
});


// Step 3: Profile photo
const photoSignupSchema = Joi.object({
  profile_photo_url: Joi.string().uri().allow('').required()
});

const validateBasicSignup = (req, res, next) => {
  const { error } = basicSignupSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ errors: error.details.map((d) => d.message) });
  }
  next();
};

const validateAdditionalSignup = (req, res, next) => {
  const { error } = additionalSignupSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ errors: error.details.map((d) => d.message) });
  }
  next();
};

const validatePhotoSignup = (req, res, next) => {
  const { error } = photoSignupSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ errors: error.details.map((d) => d.message) });
  }
  next();
};

module.exports = {
  validateBasicSignup,
  validateAdditionalSignup,
  validatePhotoSignup
};
