const Joi = require("joi");

const busSearchSchema = Joi.object({
  busStopCode: Joi.string().required().length(5).pattern(/^\d+$/)
});

function validateBusSearch(req, res, next) {
  const { error } = busSearchSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}

module.exports = validateBusSearch;
