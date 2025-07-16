// controllers/userprofileController.js
const sql = require("mssql");
const dbConfig = require('../../../db/dbConfig');
const UserProfile = require("../models/userprofileModel");
const bcrypt = require("bcrypt");

// Unified update logic
exports.updateUserProfile = async (req, res) => {
  const profileId = parseInt(req.params.id, 10);
  const { name, birthday, activity_level, profile_photo_url } = req.body;

  if (
    typeof name !== 'string' || !name.trim() ||
    !birthday || !activity_level || typeof activity_level !== 'string'
  ) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  const birthdayDate = new Date(birthday);
  if (isNaN(birthdayDate.getTime())) {
    return res.status(400).json({ error: 'Invalid birthday date format' });
  }

  const pool = await sql.connect(dbConfig);
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    // Step 1: Get user_id from profile_id
    const getUserIdRequest = new sql.Request(transaction);
    const userResult = await getUserIdRequest
      .input("profile_id", sql.Int, profileId)
      .query("SELECT user_id FROM UserProfiles WHERE profile_id = @profile_id");

    if (userResult.recordset.length === 0) {
      await transaction.rollback();
      return res.status(404).json({ error: "User profile not found" });
    }

    const userId = userResult.recordset[0].user_id;

    // Step 2: Update Users table
    let request1 = new sql.Request(transaction);
    await request1
      .input("user_id", sql.Int, userId)
      .input("name", sql.NVarChar(100), name)
      .input("birthday", sql.Date, birthdayDate)
      .query(`
        UPDATE Users
        SET name = @name,
            birthday = @birthday
        WHERE user_id = @user_id
      `);

    // Step 3: Update UserProfiles table using profile_id
    let request2 = new sql.Request(transaction);
    await request2
      .input("profile_id", sql.Int, profileId)
      .input("activity_level", sql.NVarChar(50), activity_level)
      .input("profile_photo_url", sql.NVarChar(255), profile_photo_url)
      .query(`
        UPDATE UserProfiles
        SET activity_level = @activity_level,
            profile_photo_url = @profile_photo_url
        WHERE profile_id = @profile_id
      `);

    await transaction.commit();
    res.send("User profile updated");
  } catch (err) {
    await transaction.rollback();
    console.error("Update failed:", err);
    res.status(500).send("Error updating user profile");
  }
};

exports.getAllUserProfiles = async (req, res) => {
  try {
    const profiles = await UserProfile.getAll();
    res.json(profiles);
  } catch (err) {
    res.status(500).send("Error fetching user profiles");
  }
};

exports.getUserProfileById = async (req, res) => {
  try {
    const profile = await UserProfile.getById(req.params.id);
    if (!profile) {
      return res.status(404).send("User profile not found");
    }
    res.json(profile);
  } catch (err) {
    res.status(500).send("Error retrieving user profile");
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const profileData = { ...req.body };
    
    // Hash password if provided
    if (profileData.password) {
      const saltRounds = 10;
      profileData.password_hash = await bcrypt.hash(profileData.password, saltRounds);
      delete profileData.password; // Remove plain password
    }
    
    await UserProfile.update(req.params.id, profileData);
    res.send("User profile updated successfully");
  } catch (err) {
    console.error("Error updating user profile:", err);
    res.status(500).send("Error updating user profile");
  }
};

exports.deleteUserProfile = async (req, res) => {
  try {
    await UserProfile.delete(req.params.id);
    res.send("User profile deleted");
  } catch (err) {
    res.status(500).send("Error deleting user profile");
  }
};
