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

module.exports = validateReminder;
