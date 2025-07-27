const sql = require("mssql");
const dbConfig = require("../dbConfig");

// Get all contacts for a user
exports.getContactsByUser = async (userId) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input("userId", sql.Int, userId)
    .query("SELECT * FROM EmergencyContacts WHERE user_id = @userId ORDER BY contact_id DESC");
  return result.recordset;
};

// Add a new contact
exports.addContact = async (userId, name, phone_number, relationship) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input("userId", sql.Int, userId)
    .input("name", sql.NVarChar, name)
    .input("phone_number", sql.NVarChar, phone_number)
    .input("relationship", sql.NVarChar, relationship)
    .query(`
      INSERT INTO EmergencyContacts (user_id, name, phone_number, relationship)
      OUTPUT INSERTED.*
      VALUES (@userId, @name, @phone_number, @relationship)
    `);
  return result.recordset[0];
};

// Update a contact
exports.updateContact = async (contactId, name, phone_number, relationship) => {
  const pool = await sql.connect(dbConfig);
  await pool.request()
    .input("contactId", sql.Int, contactId)
    .input("name", sql.NVarChar, name)
    .input("phone_number", sql.NVarChar, phone_number)
    .input("relationship", sql.NVarChar, relationship)
    .query(`
      UPDATE EmergencyContacts
      SET name = @name, phone_number = @phone_number, relationship = @relationship
      WHERE contact_id = @contactId
    `);
};

// Delete a contact
exports.deleteContact = async (contactId) => {
  const pool = await sql.connect(dbConfig);
  await pool.request()
    .input("contactId", sql.Int, contactId)
    .query("DELETE FROM EmergencyContacts WHERE contact_id = @contactId");
};
