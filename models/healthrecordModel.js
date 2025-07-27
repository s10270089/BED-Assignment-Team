const sql = require('mssql');
const dbConfig = require('../dbConfig');

const userId = 1; // Hardcoded for now

module.exports = {
  async getAll() {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query('SELECT * FROM HealthRecords WHERE userId = @userId');
    return result.recordset;
  },

  async getById(id) {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('userId', sql.Int, userId)
      .query('SELECT * FROM HealthRecords WHERE id = @id AND userId = @userId');
    return result.recordset[0];
  },

  async create(record) {
    const { condition, notes, dateRecorded } = record;
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input('userId', sql.Int, userId)
      .input('condition', sql.NVarChar, condition)
      .input('notes', sql.NVarChar, notes)
      .input('dateRecorded', sql.DateTime, dateRecorded)
      .query('INSERT INTO HealthRecords (userId, condition, notes, dateRecorded) VALUES (@userId, @condition, @notes, @dateRecorded)');
  },

  async update(id, record) {
    const { condition, notes, dateRecorded } = record;
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('userId', sql.Int, userId)
      .input('condition', sql.NVarChar, condition)
      .input('notes', sql.NVarChar, notes)
      .input('dateRecorded', sql.DateTime, dateRecorded)
      .query('UPDATE HealthRecords SET condition = @condition, notes = @notes, dateRecorded = @dateRecorded WHERE id = @id AND userId = @userId');
    return result.rowsAffected[0];
  },

  async remove(id) {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('userId', sql.Int, userId)
      .query('DELETE FROM HealthRecords WHERE id = @id AND userId = @userId');
    return result.rowsAffected[0];
  }
};
