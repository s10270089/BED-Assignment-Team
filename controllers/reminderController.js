const reminderModel = require('../models/reminderModel');

exports.getReminders = async (req, res) => {
    try {
        const reminders = await reminderModel.getAllReminders(req.user.id);
        res.json(reminders);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve reminders' });
    }
};

exports.createReminder = async (req, res) => { 
    try {
        console.log("Received user_id:", req.user.id);  // Debugging line
        const { message, reminder_time } = req.body;
        const user_id = req.user.user_id;  // Ensure we are extracting the correct user_id from the JWT token

        if (!user_id) {
            return res.status(400).json({ error: 'User ID is missing in the request.' });
        }

        await reminderModel.createReminder({ 
            user_id,
            message,
            reminder_time 
        });

        res.status(201).json({ message: 'Reminder created successfully' });
    } catch (err) {
        console.error('Error creating reminder:', err);
        res.status(500).json({ error: 'Failed to create reminder' });
    }
};


exports.updateReminder = async (req, res) => {
    try {
        const { message, reminder_time } = req.body;
        await reminderModel.updateReminder(req.params.id, message, reminder_time);
        res.json({ message: 'Reminder updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update reminder' });
    }
};

exports.deleteReminder = async (req, res) => {
    try {
        await reminderModel.deleteReminder(req.params.id);
        res.json({ message: 'Reminder deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete reminder' });
    }
};
