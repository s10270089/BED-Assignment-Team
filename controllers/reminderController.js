const reminderModel = require('../models/reminderModel');

exports.getAllReminders = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        console.log("Received user_id:", user_id);

        const reminders = await reminderModel.getAllReminders(user_id);
        res.json(reminders);
    } catch (err) {
        console.error("Error fetching reminders:", err);
        res.status(500).json({ error: 'Failed to retrieve reminders' });
    }
};


exports.createReminder = async (req, res) => { 
    try {
        console.log("Received user_id:", req.user.id);
        const { message, reminder_time } = req.body;
        const user_id = req.user.user_id;

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
    try{
        const reminder_id = req.params.id;
        const { message, reminder_time, is_completed} = req.body;
        const user_id = req.user.user_id;
        console.log('Received data:', req.body);
        console.log('User ID:', req.user.user_id);

        if (!reminder_id || !message || !reminder_time) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        await reminderModel.updateReminderTime(user_id, reminder_id, reminder_time, message, is_completed);
        res.json({ message: 'Reminder updated successfully' });
    }  catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}


exports.deleteReminder = async (req, res) => {
    try {
        await reminderModel.deleteReminder(req.params.id);
        res.json({ message: 'Reminder deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete reminder' });
    }
};
