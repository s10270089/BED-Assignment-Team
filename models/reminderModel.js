// models/reminderModel.js
const sql = require('mssql');
const dbConfig = require('../dbConfig');

exports.getAllReminders = async (user_id) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input('user_id', sql.Int, user_id)
    .query('SELECT * FROM Reminders WHERE user_id = @user_id ORDER BY reminder_time ASC');
  return result.recordset;
};

exports.createReminder = async (reminder) => {
  const { user_id, message, reminder_time } = reminder;
  const pool = await sql.connect(dbConfig);
  
  // Ensure correct input types for SQL query
  await pool.request()
    .input('user_id', sql.Int, user_id)
    .input('message', sql.NVarChar, message)
    .input('reminder_time', sql.DateTime, reminder_time)
    .query(`
      INSERT INTO Reminders (user_id, message, reminder_time)
      VALUES (@user_id, @message, @reminder_time)
    `);

  console.log('Reminder created successfully!');
};

// In your model
exports.updateReminder = async (reminder_id, reminder_time) => {
  const pool = await sql.connect(dbConfig);
  await pool.request()
      .input('reminder_id', sql.Int, reminder_id)
      .input('message', sql.NVarChar(255), message)
      .input('reminder_time', sql.DateTime, reminder_time)
      .input('is_completed', sql.Bit, is_completed ? 1 : 0)
      .query(`UPDATE Reminders SET message = @message, reminder_time = @reminder_time, is_completed = @is_completed WHERE reminder_id = @reminder_id`);
      
      res.status(200).json({ success: true });
}


exports.deleteReminder = async (reminder_id) => {
  const pool = await sql.connect(dbConfig);
  await pool.request()
    .input('reminderId', sql.Int, reminder_id)
    .query('DELETE FROM Reminders WHERE reminder_id = @reminder_id');
};
