// models/medicationModel.js
const sql = require("mssql");
const dbConfig = require("../../../db/dbConfig");

exports.getAll = async () => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request().query("SELECT * FROM Medications");
  return result.recordset;
};

exports.getById = async (id) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input("id", sql.Int, id)
    .query("SELECT * FROM Medications WHERE id = @id");
  return result.recordset[0];
};

exports.create = async (med) => {
  const { name, dosage, time, frequency } = med;
  const pool = await sql.connect(dbConfig);
  await pool.request()
    .input("name", sql.NVarChar, name)
    .input("dosage", sql.NVarChar, dosage)
    .input("time", sql.NVarChar, time)
    .input("frequency", sql.NVarChar, frequency)
    .query("INSERT INTO Medications (name, dosage, time, frequency) VALUES (@name, @dosage, @time, @frequency)");
};

exports.update = async (id, med) => {
  const { name, dosage, time, frequency } = med;
  const pool = await sql.connect(dbConfig);
  await pool.request()
    .input("id", sql.Int, id)
    .input("name", sql.NVarChar, name)
    .input("dosage", sql.NVarChar, dosage)
    .input("time", sql.NVarChar, time)
    .input("frequency", sql.NVarChar, frequency)
    .query("UPDATE Medications SET name = @name, dosage = @dosage, time = @time, frequency = @frequency WHERE id = @id");
};

exports.delete = async (id) => {
  const pool = await sql.connect(dbConfig);
  await pool.request()
    .input("id", sql.Int, id)
    .query("DELETE FROM Medications WHERE id = @id");
};
