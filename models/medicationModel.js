// models/medicationModel.js
const sql = require("mssql");
const dbConfig = require("../dbConfig");

exports.getAll = async (user_id) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input("user_id", sql.Int, user_id)
    .query("SELECT * FROM Medications WHERE user_id = @user_id");
  return result.recordset;
};

exports.getById = async (id, user_id) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input("id", sql.Int, id)
    .input("user_id", sql.Int, user_id)
    .query("SELECT * FROM Medications WHERE id = @id AND user_id = @user_id");
  return result.recordset[0];
};

exports.create = async (med) => {
  const { name, dosage, time, frequency, user_id } = med;
  const pool = await sql.connect(dbConfig);
  await pool.request()
    .input("name", sql.NVarChar, name)
    .input("dosage", sql.NVarChar, dosage)
    .input("time", sql.NVarChar, time)
    .input("frequency", sql.NVarChar, frequency)
    .input("user_id", sql.Int, user_id)
    .query("INSERT INTO Medications (name, dosage, time, frequency, user_id) VALUES (@name, @dosage, @time, @frequency, @user_id)");
};

exports.update = async (id, med, user_id) => {
  const { name, dosage, time, frequency } = med;
  const pool = await sql.connect(dbConfig);
  await pool.request()
    .input("id", sql.Int, id)
    .input("user_id", sql.Int, user_id)
    .input("name", sql.NVarChar, name)
    .input("dosage", sql.NVarChar, dosage)
    .input("time", sql.NVarChar, time)
    .input("frequency", sql.NVarChar, frequency)
    .query("UPDATE Medications SET name = @name, dosage = @dosage, time = @time, frequency = @frequency WHERE id = @id AND user_id = @user_id");
};

exports.delete = async (id, user_id) => {
  const pool = await sql.connect(dbConfig);
  await pool.request()
    .input("id", sql.Int, id)
    .input("user_id", sql.Int, user_id)
    .query("DELETE FROM Medications WHERE id = @id AND user_id = @user_id");
};
