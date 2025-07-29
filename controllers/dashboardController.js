const DashboardModel = require('../models/dashboardModel');

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.user_id;
    if (!userId) {
      return res.status(400).json({ error: "User not authenticated." });
    }

    const name = await DashboardModel.getUsername(userId);

    // Fetch data for BMI
    const { height, weight } = await DashboardModel.getBMI(userId);
    if (!height || !weight) {
      return res.status(404).json({ error: 'Height or weight not found.' });
    }
    const height_m = height / 100;
    const bmi = weight / (height_m * height_m);

    // Fetch friends list
    const friends = await DashboardModel.getFriends(userId);

    // Fetch upcoming events
    const events = await DashboardModel.getUpcomingEvents(userId);

    // Fetch reminders
    const reminders = await DashboardModel.getReminders(userId);

    // Return all data together
    res.json({
      userInfo: {
        name,
        bmi: bmi.toFixed(2),
        height,
        weight
      },
      friendsList: friends,
      upcomingEvents: events,
      reminders: reminders
    });
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    res.status(500).send('Error fetching dashboard data');
  }
};
