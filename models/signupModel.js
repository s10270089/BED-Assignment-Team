const sql = require('mssql');
const dbConfig = require('../dbConfig');

// Insert User with Profile Photo URL and create UserProfile
exports.insertUser = async ({ name, email, hashedPassword, birthday, height, weight, profile_photo_url, gender }) => {
  const pool = await sql.connect(dbConfig);
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();
    const request = new sql.Request(transaction);

    // Log the data being inserted into the database
    console.log('Inserting user data:', { name, email, hashedPassword, birthday, height, weight, profile_photo_url, gender });

    // Check if email already exists
    const existing = await request
      .input('email', sql.NVarChar, email)
      .query('SELECT user_id FROM Users WHERE email = @email');

    if (existing.recordset.length > 0) {
      const err = new Error('Email already exists');
      err.code = 'EMAIL_EXISTS';
      throw err;
    }

    // Log the SQL query
    console.log("Running SQL query to insert user:");
    
    // Insert into Users table
    const userResult = await request
      .input('name', sql.NVarChar, name)
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

    const userId = userResult.recordset[0].user_id;
    console.log("User inserted with ID:", userId);

    // Insert into UserProfiles table with the same profile photo URL
    console.log("Creating UserProfile entry for user:", userId, "with profile photo:", profile_photo_url);
    const profileResult = await request
      .input('user_id', sql.Int, userId)
      // Use the same profile_photo_url parameter for UserProfiles table
      .query(`
        INSERT INTO UserProfiles (user_id, profile_photo_url)
        OUTPUT INSERTED.profile_id
        VALUES (@user_id, @profile_photo_url)
      `);

    const profileId = profileResult.recordset[0].profile_id;
    console.log("UserProfile created with ID:", profileId, "and profile photo URL:", profile_photo_url);

    await transaction.commit();
    
    // Log the result of the query
    console.log("SQL insert result - User ID:", userId, "Profile ID:", profileId);

    return { userId, profileId };  // Return both user and profile IDs
  } catch (error) {
    await transaction.rollback();
    console.error("Transaction failed:", error);
    throw error;
  }
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

  // Also update UserProfiles table if profile_photo_url is provided
  if (profile_photo_url) {
    console.log('Updating UserProfiles table with new profile photo');
    await pool.request()
      .input('user_id', sql.Int, userId)
      .input('profile_photo_url', sql.NVarChar, profile_photo_url)
      .query(`
        UPDATE UserProfiles 
        SET profile_photo_url = @profile_photo_url 
        WHERE user_id = @user_id
      `);
  }

  // Log the result of the update
  console.log("SQL update result:", result);

  return result.rowsAffected[0];  // Returns the number of rows affected
};
