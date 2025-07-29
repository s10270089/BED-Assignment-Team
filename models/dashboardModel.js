const sql = require('mssql');
const dbConfig = require('../dbConfig');

// Fetch the BMI data for the user
exports.getBMI = async (user_id) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input('user_id', sql.Int, user_id)
    .query('SELECT height, weight FROM Users WHERE user_id = @user_id');
  return result.recordset[0]; // { height_cm, weight_kg }
};

// Fetch all appointments for the user
exports.getAppointments = async (user_id) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input('user_id', sql.Int, user_id)
    .query('SELECT * FROM Appointments WHERE user_id = @user_id ORDER BY appointment_time ASC');
  return result.recordset;
};

// Fetch all reminders for the user
exports.getReminders = async (user_id) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input('user_id', sql.Int, user_id)
    .query('SELECT * FROM Reminders WHERE user_id = @user_id AND is_completed = 0');
  return result.recordset;
};

// Fetch friends list for a specific user
exports.getFriendsList = async (user_id) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input("user_id", sql.Int, user_id)
    .query(`
      SELECT u.user_id, u.name, u.email 
      FROM Users u
      JOIN Friendships f ON (f.sender_id = u.user_id OR f.receiver_id = u.user_id)
      WHERE (f.sender_id = @user_id OR f.receiver_id = @user_id) AND f.status = 'accepted'
    `);
  return result.recordset;
};

// Fetch upcoming events for a user
exports.getUpcomingEvents = async (user_id) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input("user_id", sql.Int, user_id)
    .query(`
      SELECT title, description, event_time 
      FROM Events 
      WHERE user_id = @user_id AND event_time > GETDATE()
      ORDER BY event_time ASC
    `);
  return result.recordset;
};
