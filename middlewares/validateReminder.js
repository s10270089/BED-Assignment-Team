const Joi = require('joi');

const reminderSchema = Joi.object({
    message: Joi.string().min(3).max(255).required(),
    reminder_time: Joi.date().required()
});

function validateReminder(req, res, next) {
    const { error } = reminderSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}

module.exports = (req, res, next) => {
  // Validate the reminder ID or data before proceeding to the controller
  if (req.method === 'POST' || req.method === 'PUT') {
    const { message, reminder_time } = req.body;
    if (!message || !reminder_time) {
      return res.status(400).json({ message: 'Message and time are required' });
    }
  }

  next();  // Proceed to the controller
};

module.exports = validateReminder;
