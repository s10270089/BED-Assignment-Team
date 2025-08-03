const DashboardModel = require('../models/dashboardModel');

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.user_id;
    if (!userId) {
      return res.status(400).json({ error: "User not authenticated." });
    }

    // Fetch User Data
    const name = await DashboardModel.getUsername(userId);
    const { height, weight, gender } = await DashboardModel.getUserDetails(userId); // Get user details including gender
    const friends = await DashboardModel.getFriends(userId);
    const events = await DashboardModel.getUpcomingEvents(userId);
    const reminders = await DashboardModel.getReminders(userId);
    const appointments = await DashboardModel.getAppointments(userId);

    // Fetch Profile Photo URL (Default if not found)
    const userProfile = await DashboardModel.getUserProfile(userId); // Fetch User Profile
    let profilePhotoUrl = userProfile ? userProfile.profile_photo_url : null;

    // Default profile photo based on gender if not provided
    if (!profilePhotoUrl) {
      profilePhotoUrl = gender === 'female' 
        ? 'https://res.cloudinary.com/dqnoqh0hi/image/upload/v1738043459/samples/outdoor-woman.jpg' 
        : 'https://res.cloudinary.com/dqnoqh0hi/image/upload/v1738043459/samples/man-portrait.jpg';
    }

    const height_m = height / 100;
    const bmi = weight / (height_m * height_m);

    res.json({
      userInfo: {
        name,
        bmi: bmi.toFixed(2),
        height,
        weight,
        profile_photo_url: profilePhotoUrl
      },
      friendsList: friends,
      upcomingEvents: events,
      reminders: reminders,
      appointments: appointments,
    });
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    res.status(500).send('Error fetching dashboard data');
  }
};
