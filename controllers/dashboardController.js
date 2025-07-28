const DashboardModel = require('../models/dashboardModel');

exports.getBMI = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { height_cm, weight_kg } = await DashboardModel.getBMI(userId);
    if (!height_cm || !weight_kg) return res.status(404).json({ error: 'Height or weight not found.' });
    // BMI = weight (kg) / [height (m)]^2
    const height_m = height_cm / 100;
    const bmi = weight_kg / (height_m * height_m);
    res.json({ bmi: bmi.toFixed(2), height_cm, weight_kg });
  } catch (err) {
    console.error('Error fetching BMI:', err);
    res.status(500).send('Error fetching BMI');
  }
};

// Fetch all appointments
exports.getAppointments = async (req, res) => {
  try {
    const userId = req.user.user_id;  // Get the user_id from the token (after authentication)
    const appointments = await DashboardModel.getAppointments(userId);
    res.json(appointments);  // Send the appointments as JSON
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).send('Error fetching appointments');
  }
};

// Fetch all reminders
exports.getReminders = async (req, res) => {
  try {
    const userId = req.user.user_id;  // Get the user_id from the token (after authentication)
    const reminders = await DashboardModel.getReminders(userId);
    res.json(reminders);  // Send the reminders as JSON
  } catch (err) {
    console.error('Error fetching reminders:', err);
    res.status(500).send('Error fetching reminders');
  }
};
