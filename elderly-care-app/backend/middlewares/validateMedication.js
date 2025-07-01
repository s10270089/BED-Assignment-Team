const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().min(2).required(),
  dosage: Joi.string().required(),
  time: Joi.string().required(),
  frequency: Joi.string().required(),
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
