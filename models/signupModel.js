const sql = require('mssql');
const dbConfig = require('../dbConfig');

// Insert User with Profile Photo URL
exports.insertUser = async ({ name, email, hashedPassword, birthday, height, weight, profile_photo_url, gender }) => {
  const pool = await sql.connect(dbConfig);

  // Log the data being inserted into the database
  console.log('Inserting user data:', { name, email, hashedPassword, birthday, height, weight, profile_photo_url, gender });

  // Check if email already exists
  const existing = await pool.request()
    .input('email', sql.NVarChar, email)
    .query('SELECT user_id FROM Users WHERE email = @email');

  if (existing.recordset.length > 0) {
    const err = new Error('Email already exists');
    err.code = 'EMAIL_EXISTS';
    throw err;
  }

  // Log the SQL query
  console.log("Running SQL query to insert user:");
  
  const result = await pool.request()
    .input('name', sql.NVarChar, name)
    .input('email', sql.NVarChar, email)
    .input('password_hash', sql.NVarChar, hashedPassword)
    .input('birthday', sql.Date, birthday)
    .input('height', sql.Float, height || null)
    .input('weight', sql.Float, weight || null)
    .input('profile_photo_url', sql.NVarChar, profile_photo_url || null)
    .input('gender', sql.NVarChar, gender)
    .query(`
      INSERT INTO Users (name, email, password_hash, birthday, height, weight, profile_photo_url, gender)
      OUTPUT INSERTED.user_id
      VALUES (@name, @email, @password_hash, @birthday, @height, @weight, @profile_photo_url, @gender)
    `);

  // Log the result of the query
  console.log("SQL insert result:", result);

  return result.recordset[0].user_id;  // Return the inserted user ID
};
exports.updateUserDetails = async (userId, { birthday, height, weight, gender, profile_photo_url }) => {
  const pool = await sql.connect(dbConfig);

  // Log the update data
  console.log('Updating user data:', { userId, birthday, height, weight, gender, profile_photo_url });

  let query = `
    UPDATE Users
    SET birthday = @birthday,
        height = @height,
        weight = @weight,
        gender = @gender
  `;

  if (profile_photo_url) {
    query += `, profile_photo_url = @profile_photo_url`;
  }

  query += ` WHERE user_id = @user_id`;

  // Log the SQL query
  console.log("Running SQL query to update user:", query);

  const result = await pool.request()
    .input('user_id', sql.Int, userId)
    .input('birthday', sql.Date, birthday || null)
    .input('height', sql.Float, height || null)
    .input('weight', sql.Float, weight || null)
    .input('gender', sql.NVarChar, gender || null)
    .input('profile_photo_url', sql.NVarChar, profile_photo_url || null)
    .query(query);

  // Log the result of the update
  console.log("SQL update result:", result);

  return result.rowsAffected[0];  // Returns the number of rows affected
};
