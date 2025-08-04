const sql = require('mssql');
const dbConfig = require('../dbConfig');

// Fetch all health records for a specific user
exports.getAll = async (user_id) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input("user_id", sql.Int, user_id)
    .query("SELECT * FROM HealthRecords WHERE user_id = @user_id");
  return result.recordset;
};

// Fetch a health record by its record_id for a specific user
exports.getById = async (record_id, user_id) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input('record_id', sql.Int, record_id)  // Changed 'id' to 'record_id'
    .input('user_id', sql.Int, user_id)
    .query('SELECT * FROM HealthRecords WHERE record_id = @record_id AND user_id = @user_id');
  return result.recordset[0];
};

// Create a new health record
exports.create = async (record) => {
  const { allergies, diagnosis, doctor_contact, emergency_contact, last_updated, user_id } = record;
  const pool = await sql.connect(dbConfig);

  try {
    await pool.request()
      .input('user_id', sql.Int, user_id)
      .input('allergies', sql.NVarChar, allergies)
      .input('diagnosis', sql.NVarChar, diagnosis)
      .input('doctor_contact', sql.NVarChar, doctor_contact)
      .input('emergency_contact', sql.NVarChar, emergency_contact)
      .input('last_updated', sql.DateTime, last_updated)
      .query(`
        INSERT INTO HealthRecords 
        (user_id, allergies, diagnosis, doctor_contact, emergency_contact, last_updated) 
        VALUES 
        (@user_id, @allergies, @diagnosis, @doctor_contact, @emergency_contact, @last_updated)
      `);
  } catch (err) {
    console.error("Database Insert Error:", err);  // Log any database insertion errors
    throw err;  // Propagate the error so it can be caught in the controller
  }
};


// Update an existing health record by record_id
exports.update = async (record_id, record, user_id) => {
  const { allergies, diagnosis, doctor_contact, emergency_contact, last_updated } = record;
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input('record_id', sql.Int, record_id)
    .input('user_id', sql.Int, user_id)
    .input('allergies', sql.NVarChar, allergies)
    .input('diagnosis', sql.NVarChar, diagnosis)
    .input('doctor_contact', sql.NVarChar, doctor_contact)
    .input('emergency_contact', sql.NVarChar, emergency_contact)
    .input('last_updated', sql.DateTime, last_updated)
    .query(`
      UPDATE HealthRecords 
      SET allergies = @allergies, diagnosis = @diagnosis, 
          doctor_contact = @doctor_contact, emergency_contact = @emergency_contact, 
          last_updated = @last_updated 
      WHERE record_id = @record_id AND user_id = @user_id
    `);
  return result.rowsAffected[0];
};



// Remove a health record by record_id
exports.remove = async (record_id, user_id) => {
  const pool = await sql.connect(dbConfig);
  await pool.request()
    .input('record_id', sql.Int, record_id)
    .input('user_id', sql.Int, user_id)
    .query('DELETE FROM HealthRecords WHERE record_id = @record_id AND user_id = @user_id');
};
