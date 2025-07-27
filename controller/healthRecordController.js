const sql = require('mssql');
const dbConfig = require('../dbConfig');
const getUserId = require('../utils/getUserId.js'); // You must create this helper

exports.getAllHealthRecords = async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('userId', sql.Int, getUserId(req))
      .query('SELECT * FROM HealthRecords WHERE userId = @userId');
    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching records', error });
  }
};

exports.getHealthRecordById = async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('userId', sql.Int, getUserId(req))
      .query('SELECT * FROM HealthRecords WHERE id = @id AND userId = @userId');
    if (result.recordset.length === 0) return res.status(404).json({ message: 'Record not found' });
    res.status(200).json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching record', error });
  }
};

exports.createHealthRecord = async (req, res) => {
  try {
    const { condition, notes, dateRecorded } = req.body;
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input('userId', sql.Int, getUserId(req))
      .input('condition', sql.NVarChar, condition)
      .input('notes', sql.NVarChar, notes)
      .input('dateRecorded', sql.DateTime, dateRecorded)
      .query('INSERT INTO HealthRecords (userId, condition, notes, dateRecorded) VALUES (@userId, @condition, @notes, @dateRecorded)');
    res.status(201).json({ message: 'Health record created' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating record', error });
  }
};

exports.updateHealthRecord = async (req, res) => {
  try {
    const { condition, notes, dateRecorded } = req.body;
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('userId', sql.Int, getUserId(req))
      .input('condition', sql.NVarChar, condition)
      .input('notes', sql.NVarChar, notes)
      .input('dateRecorded', sql.DateTime, dateRecorded)
      .query('UPDATE HealthRecords SET condition = @condition, notes = @notes, dateRecorded = @dateRecorded WHERE id = @id AND userId = @userId');
    if (result.rowsAffected[0] === 0) return res.status(404).json({ message: 'Record not found or not owned by user' });
    res.status(200).json({ message: 'Health record updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating record', error });
  }
};

exports.deleteHealthRecord = async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('userId', sql.Int, getUserId(req))
      .query('DELETE FROM HealthRecords WHERE id = @id AND userId = @userId');
    if (result.rowsAffected[0] === 0) return res.status(404).json({ message: 'Record not found or not owned by user' });
    res.status(200).json({ message: 'Health record deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting record', error });
  }
};