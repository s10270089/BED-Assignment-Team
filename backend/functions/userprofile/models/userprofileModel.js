// userprofileModel.js
const sql = require("mssql");
const dbConfig = require("../../../db/dbConfig.js");

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
      up.activity_level,
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
        up.activity_level,
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


// Create user profile and update Users table age
async function create(profile) {
  const { user_id, age, activity_level, profile_photo_url } = profile;
  const pool = await sql.connect(dbConfig);
  const transaction = new sql.Transaction(pool);

  await transaction.begin();

  try {
    const request = new sql.Request(transaction);

    // Insert into UserProfiles
    const result = await request
      .input("user_id", sql.Int, user_id)
      .input("age", sql.Int, age)
      .input("activity_level", sql.NVarChar, activity_level)
      .input("profile_photo_url", sql.NVarChar, profile_photo_url)
      .query(`INSERT INTO UserProfiles (user_id, age, activity_level, profile_photo_url) 
              OUTPUT INSERTED.profile_id
              VALUES (@user_id, @age, @activity_level, @profile_photo_url)`);

    // Update Users table age
    await request
      .input("user_age", sql.Int, age)
      .input("user_id_ref", sql.Int, user_id)
      .query(`UPDATE Users SET age = @user_age WHERE user_id = @user_id_ref`);

    await transaction.commit();
    return result.recordset[0];
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

// Update user profile and Users age
async function update(id, profile) {
  const { user_id, name, birthday, activity_level, profile_photo_url } = profile;

  const pool = await sql.connect(dbConfig);
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();
    const request = new sql.Request(transaction);

    // Update UserProfiles table
    await request
      .input("id", sql.Int, id)
      .input("user_id", sql.Int, user_id)
      .input("activity_level", sql.NVarChar(50), activity_level)
      .input("profile_photo_url", sql.NVarChar(255), profile_photo_url)
      .query(`
        UPDATE UserProfiles 
        SET 
          user_id = @user_id, 
          activity_level = @activity_level, 
          profile_photo_url = @profile_photo_url
        WHERE profile_id = @id
      `);

    // Update Users table — name and birthday
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
    .query("DELETE FROM UserProfiles WHERE profile_id = @id");
}

// Get exercise recommendations based on activity level
async function getExerciseRecommendations(activityLevel) {
  let recommendations = [];

  switch (activityLevel.toLowerCase()) {
    case 'low':
      recommendations = [
        "Gentle walking for 10-15 minutes",
        "Chair exercises and stretching",
        "Light yoga or tai chi",
        "Balance exercises",
        "Water aerobics"
      ];
      break;
    case 'medium':
      recommendations = [
        "Brisk walking for 20-30 minutes",
        "Swimming or water exercises",
        "Resistance band workouts",
        "Dancing or aerobic classes",
        "Gardening activities"
      ];
      break;
    case 'high':
      recommendations = [
        "Jogging or power walking for 30-45 minutes",
        "Cycling or stationary bike",
        "Strength training with weights",
        "Sports activities (tennis, golf)",
        "Hiking or outdoor activities"
      ];
      break;
    default:
      recommendations = [
        "Gentle walking for 10-15 minutes",
        "Chair exercises and stretching",
        "Consult with healthcare provider for personalized recommendations"
      ];
  }

  return recommendations;
}

// Get profile with exercise recommendations
async function getProfileWithRecommendations(id) {
  const profile = await getById(id);
  if (profile) {
    const recommendations = await getExerciseRecommendations(profile.activity_level);
    return {
      ...profile,
      exerciseRecommendations: recommendations
    };
  }
  return null;
}

// Export all functions at once
module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteProfile,
  getExerciseRecommendations,
  getProfileWithRecommendations
};
