const sql = require('mssql');
const dbConfig = require('../dbConfig');

exports.getUsername = async (userId) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input('user_id', sql.Int, userId)
    .query('SELECT name FROM Users WHERE user_id = @user_id');
  if (result.recordset.length === 0) {
    throw new Error('User not found');
  }
  return result.recordset[0].name;
};

exports.getBMI = async (userId) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input('user_id', sql.Int, userId)
    .query('SELECT height, weight FROM Users WHERE user_id = @user_id');
  return result.recordset[0]; // { height, weight }
};

exports.getFriends = async (userId) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input('user_id', sql.Int, userId)
    .query(`
      SELECT u.name 
      FROM Users u 
      JOIN Friendships f ON f.receiver_id = u.user_id OR f.sender_id = u.user_id 
      WHERE f.status = 'accepted' AND (f.sender_id = @user_id OR f.receiver_id = @user_id)
    `);
  return result.recordset;
};

exports.getUpcomingEvents = async (userId) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input('user_id', sql.Int, userId)
    .query(`
      SELECT title, event_time 
      FROM Events 
      WHERE user_id = @user_id AND event_time >= GETDATE()
      ORDER BY event_time ASC
    `);
  return result.recordset;
};

exports.getReminders = async (userId) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input('user_id', sql.Int, userId)
    .query(`
      SELECT message, reminder_time, is_completed 
      FROM Reminders 
      WHERE user_id = @user_id
    `);
  return result.recordset;
};
