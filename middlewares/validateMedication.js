const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().min(2).required(),

  dosage: Joi.string()
    .pattern(/^\d+\s*(mg|IU|mL|tablet|capsule)$/)
    .required()
    .messages({
      "string.pattern.base": "Dosage must be a number followed by a valid unit (e.g. 500 mg)"
    }),

  time: Joi.string().required(),

  frequency: Joi.number().integer().min(1).required(),


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
