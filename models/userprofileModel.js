// userprofileModel.js
const sql = require("mssql");
const dbConfig = require("../dbConfig");

// Helper function to format date without time
function formatDateOnly(date) {
  if (!date) return null;
  return new Date(date).toISOString().split('T')[0];
}

// Get all user profiles
async function getAll() {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request().query(`
    SELECT 
      up.profile_id,
      u.name,
      CAST(u.birthday AS DATE) as birthday,
      u.password_hash,
      up.profile_photo_url
    FROM UserProfiles up
    JOIN Users u ON up.user_id = u.user_id
  `);
  return result.recordset;
}


// Get user profile by ID
async function getById(id) {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input("id", sql.Int, id)
    .query(`
      SELECT 
        up.profile_id,
        u.name,
        CAST(u.birthday AS DATE) as birthday,
        u.password_hash,
        up.profile_photo_url
      FROM UserProfiles up
      JOIN Users u ON up.user_id = u.user_id
      WHERE up.profile_id = @id
    `);
  
  const profile = result.recordset[0];
  
  // Optional: Format birthday to remove time if needed
  if (profile && profile.birthday) {
    profile.birthday = formatDateOnly(profile.birthday);
  }
  
  return profile;
}


// Update user profile and Users age
async function update(id, profile) {
  const { user_id, name, birthday, password_hash, profile_photo_url } = profile;

  const pool = await sql.connect(dbConfig);
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();
    const request = new sql.Request(transaction);

    // Update UserProfiles table
    await request
      .input("id", sql.Int, id)
      .input("user_id", sql.Int, user_id)
      .input("profile_photo_url", sql.NVarChar(255), profile_photo_url)
      .query(`
        UPDATE UserProfiles 
        SET 
          user_id = @user_id, 
          profile_photo_url = @profile_photo_url
        WHERE profile_id = @id
      `);

    // Update Users table — name, birthday, and password
    let userUpdateQuery = "UPDATE Users SET ";
    let updateFields = [];
    
    if (name) {
      await request.input("name", sql.NVarChar(100), name);
      updateFields.push("name = @name");
    }
    
    if (birthday) {
      await request.input("birthday", sql.Date, birthday);
      updateFields.push("birthday = @birthday");
    }
    
    if (password_hash) {
      await request.input("password_hash", sql.NVarChar(255), password_hash);
      updateFields.push("password_hash = @password_hash");
    }
    
    if (updateFields.length > 0) {
      userUpdateQuery += updateFields.join(", ") + " WHERE user_id = @user_id";
      await request.query(userUpdateQuery);
    }

    await transaction.commit();
    return { success: true };
  } catch (err) {
    await transaction.rollback();
    console.error("Update failed:", err);
    throw err;
  }
}


// Delete user profile
async function deleteProfile(id) {
  const pool = await sql.connect(dbConfig);
  await pool.request()
    .input("id", sql.Int, id)
    .query("DELETE FROM UserProfiles WHERE profile_id = @id")
    .query("DELETE FROM Users WHERE user_id = @id");
}

// Export all functions at once
module.exports = {
  getAll,
  getById,
  update,
  delete: deleteProfile
};
