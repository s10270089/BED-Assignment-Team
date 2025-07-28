const sql = require('mssql');
const dbConfig = require('../dbConfig');

exports.getAll = async (user_id) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input("user_id", sql.Int, user_id)
    .query("SELECT * FROM HealthRecords WHERE user_id = @user_id"); // column name check!
  return result.recordset;
};

exports.getById = async (id, user_id) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input('id', sql.Int, id)
    .input('user_id', sql.Int, user_id)
    .query('SELECT * FROM HealthRecords WHERE id = @id AND user_id = @user_id');
  return result.recordset[0];
};

exports.create = async (record) => {
  const { condition, notes, dateRecorded, user_id } = record;
  const pool = await sql.connect(dbConfig);
  await pool.request()
    .input('user_id', sql.Int, user_id)
    .input('condition', sql.NVarChar, condition)
    .input('notes', sql.NVarChar, notes)
    .input('dateRecorded', sql.DateTime, dateRecorded)
    .query('INSERT INTO HealthRecords (user_id, condition, notes, dateRecorded) VALUES (@user_id, @condition, @notes, @dateRecorded)');
};

exports.update = async (id, record, user_id) => {
  const { condition, notes, dateRecorded } = record;
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input('id', sql.Int, id)
    .input('user_id', sql.Int, user_id)
    .input('condition', sql.NVarChar, condition)
    .input('notes', sql.NVarChar, notes)
    .input('dateRecorded', sql.DateTime, dateRecorded)
    .query('UPDATE HealthRecords SET condition = @condition, notes = @notes, dateRecorded = @dateRecorded WHERE id = @id AND user_id = @user_id');
  return result.rowsAffected[0];
};

exports.remove = async (id, user_id) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input('id', sql.Int, id)
    .input('user_id', sql.Int, user_id)
    .query('DELETE FROM HealthRecords WHERE id = @id AND user_id = @user_id');
  return result.rowsAffected[0];
};
