const express = require('express');
const router = express.Router();
const sql = require('mssql');
const dbConfig = require('../../../db/dbConfig');

// Get all reminders
router.get('/', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query('SELECT * FROM Reminders ORDER BY reminder_time');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.post('/', async (req, res) => {
  const { message, reminder_time } = req.body;
  const user_id = 1; // Hardcoded for now

  if (!message || !reminder_time) {
    return res.status(400).send('Message and reminder_time are required');
  }

  // Convert to Date object safely
  const reminderDate = new Date(reminder_time);
  if (isNaN(reminderDate)) {
    return res.status(400).send('Invalid reminder_time');
  }

  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input('user_id', sql.Int, user_id)
      .input('message', sql.NVarChar(255), message)
      .input('reminder_time', sql.DateTime, reminderDate)
      .query(`INSERT INTO Reminders (user_id, message, reminder_time) VALUES (@user_id, @message, @reminder_time)`);
      res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// Update reminder (full update)
router.post('/:id/update', async (req, res) => {
  const reminder_id = req.params.id;
  const { message, reminder_time, is_completed } = req.body;

  if (!message || !reminder_time) {
    return res.status(400).send('Message and reminder_time are required');
  }

  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input('reminder_id', sql.Int, reminder_id)
      .input('message', sql.NVarChar(255), message)
      .input('reminder_time', sql.DateTime, reminder_time)
      .input('is_completed', sql.Bit, is_completed ? 1 : 0)
      .query(`UPDATE Reminders SET message = @message, reminder_time = @reminder_time, is_completed = @is_completed WHERE reminder_id = @reminder_id`);
      res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Delete reminder
router.post('/:id/delete', async (req, res) => {
  const reminder_id = req.params.id;
  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input('reminder_id', sql.Int, reminder_id)
      .query(`DELETE FROM Reminders WHERE reminder_id = @reminder_id`);
      res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
