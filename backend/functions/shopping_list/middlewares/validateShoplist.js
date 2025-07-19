const Joi = require("joi");

// Schema for creating/updating a shopping list
const listSchema = Joi.object({
  title: Joi.string().min(1).max(100).required()
});

// Schema for adding/updating an item
const itemSchema = Joi.object({
  item_name: Joi.string().min(1).max(100).required(),
  quantity: Joi.number().integer().min(1).required(),
  notes: Joi.string().max(255).allow("").optional()
});

exports.validateList = (req, res, next) => {
  const { error } = listSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      errors: error.details.map(d => d.message)
    });
  }
  next();
};

exports.validateItem = (req, res, next) => {
  const { error } = itemSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      errors: error.details.map(d => d.message)
    });
  }
  next();
};
