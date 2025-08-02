const sql = require('mssql');
const dbConfig = require('../dbConfig');

// Fetch all appointments for a user
exports.getAllAppointments = async (user_id) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input('user_id', sql.Int, user_id)
    .query('SELECT * FROM Appointments WHERE user_id = @user_id');
  return result.recordset;
};

// Fetch a specific appointment by appointment_id
exports.getAppointmentById = async (appointment_id, user_id) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input('appointment_id', sql.Int, appointment_id)
    .input('user_id', sql.Int, user_id)
    .query('SELECT * FROM Appointments WHERE appointment_id = @appointment_id AND user_id = @user_id');
  return result.recordset[0];
};

// Create a new appointment
exports.createAppointment = async (appointment) => {
  const { user_id, appointment_date, doctor_name, purpose } = appointment;
  const pool = await sql.connect(dbConfig);
  await pool.request()
    .input('user_id', sql.Int, user_id)
    .input('appointment_date', sql.DateTime, appointment_date)
    .input('doctor_name', sql.NVarChar, doctor_name)
    .input('purpose', sql.NVarChar, purpose)
    .query(`
      INSERT INTO Appointments (user_id, appointment_date, doctor_name, purpose)
      VALUES (@user_id, @appointment_date, @doctor_name, @purpose)
    `);
};

// Update an existing appointment
exports.updateAppointment = async (appointment_id, appointment, user_id) => {
  const { appointment_date, doctor_name, purpose, status } = appointment;
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input('appointment_id', sql.Int, appointment_id)
    .input('user_id', sql.Int, user_id)
    .input('appointment_date', sql.DateTime, appointment_date)
    .input('doctor_name', sql.NVarChar, doctor_name)
    .input('purpose', sql.NVarChar, purpose)
    .input('status', sql.NVarChar, status)
    .query(`
      UPDATE Appointments
      SET appointment_date = @appointment_date, doctor_name = @doctor_name, 
          purpose = @purpose, status = @status
      WHERE appointment_id = @appointment_id AND user_id = @user_id
    `);
  return result.rowsAffected[0];
};

// Delete an appointment by ID
exports.deleteAppointment = async (appointment_id, user_id) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input('appointment_id', sql.Int, appointment_id)
    .input('user_id', sql.Int, user_id)
    .query('DELETE FROM Appointments WHERE appointment_id = @appointment_id AND user_id = @user_id');
  return result.rowsAffected[0];
};
