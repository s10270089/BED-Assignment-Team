// models/reminderModel.js
const sql      = require('mssql');
const dbConfig = require('../dbConfig');

exports.getAllReminders = async (userId) => {
  const pool   = await sql.connect(dbConfig);
  const result = await pool.request()
    .input('userId', sql.Int, userId)
    .query('SELECT * FROM Reminders WHERE user_id = @userId ORDER BY reminder_time ASC');
  return result.recordset;
};

exports.createReminder = async (userId, message, reminderTime) => {
  const pool = await sql.connect(dbConfig);
  await pool.request()
    .input('userId',       sql.Int,      userId)
    .input('message',      sql.NVarChar, message)
    .input('reminderTime', sql.DateTime, reminderTime)
    .query(`
      INSERT INTO Reminders (user_id, message, reminder_time)
      VALUES (@userId, @message, @reminderTime)
    `);
};

exports.updateReminder = async (reminderId, message, reminderTime) => {
  const pool = await sql.connect(dbConfig);
  await pool.request()
    .input('reminderId',   sql.Int,      reminderId)
    .input('message',      sql.NVarChar, message)
    .input('reminderTime', sql.DateTime, reminderTime)
    .query(`
      UPDATE Reminders
      SET message = @message,
          reminder_time = @reminderTime
      WHERE reminder_id = @reminderId
    `);
};

exports.deleteReminder = async (reminderId) => {
  const pool = await sql.connect(dbConfig);
  await pool.request()
    .input('reminderId', sql.Int, reminderId)
    .query('DELETE FROM Reminders WHERE reminder_id = @reminderId');
};

const { getAllReminders, createReminder } = require('./reminderModel');
