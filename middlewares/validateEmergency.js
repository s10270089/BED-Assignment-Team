const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  phone_number: Joi.string().min(3).max(20).required(),
  relationship: Joi.string().max(50).allow("").optional()
});

exports.validateContact = (req, res, next) => {
  const { error } = contactSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ errors: error.details.map(d => d.message) });
  }
  next();
};
