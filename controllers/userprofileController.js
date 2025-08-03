// controllers/userprofileController.js
const sql = require("mssql");
const dbConfig = require("../dbConfig");
const UserProfile = require("../models/userprofileModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or missing token" });
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

    // Update the profile using the model
    await UserProfile.update(req.params.id, profileData);
    res.json({ message: "User profile updated successfully" });
    
  } catch (err) {
    console.error("Error updating user profile:", err);
    res.status(500).json({ message: "Error updating user profile" });
  }
};

exports.deleteUserProfile = async (req, res) => {
  try {
    await UserProfile.delete(req.params.id);
    res.json({ message: "User profile deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user profile" });
  }
};

// Get user profile by user_id
exports.getUserProfileByUserId = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const pool = await sql.connect(dbConfig);
    
    const result = await pool.request()
      .input("userId", sql.Int, userId)
      .query(`
        SELECT 
          up.profile_id,
          u.user_id,
          u.name,
          CAST(u.birthday AS DATE) as birthday,
          up.profile_photo_url
        FROM UserProfiles up
        JOIN Users u ON up.user_id = u.user_id
        WHERE u.user_id = @userId
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Profile not found for this user' });
    }
    
    const profile = result.recordset[0];
    
    // Format date properly
    if (profile && profile.birthday) {
      profile.birthday = profile.birthday.toISOString().split('T')[0];
    }
    
    console.log('Profile found for user_id:', userId, profile);
    res.json(profile);
    
  } catch (error) {
    console.error('Error fetching profile by user_id:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message 
    });
  }
};

// Update user profile by user_id
exports.updateUserProfileByUserId = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    console.log('Updating profile for user_id:', userId, 'with data:', req.body);

    // First, get the profile_id for this user
    const pool = await sql.connect(dbConfig);
    const profileResult = await pool.request()
      .input("userId", sql.Int, userId)
      .query("SELECT profile_id FROM UserProfiles WHERE user_id = @userId");
    
    if (profileResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Profile not found for this user' });
    }
    
    const profileId = profileResult.recordset[0].profile_id;
    console.log('Found profile_id:', profileId, 'for user_id:', userId);
    
    // Prepare the data for update
    const updateData = { ...req.body };
    
    // Hash password if provided
    if (updateData.password) {
      const saltRounds = 10;
      updateData.password_hash = await bcrypt.hash(updateData.password, saltRounds);
      delete updateData.password; // Remove plain password
    }
    
    // Now use the existing update logic with profile_id
    const userprofileModel = require('../models/userprofileModel');
    const updatedProfile = await userprofileModel.update(profileId, updateData);
    
    res.json({ 
      message: 'Profile updated successfully', 
      profile: updatedProfile 
    });
    
  } catch (error) {
    console.error('Error updating profile by user_id:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message 
    });
  }
};

// Delete user profile by user_id
exports.deleteUserProfileByUserId = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // First, get the profile_id for this user
    const pool = await sql.connect(dbConfig);
    const profileResult = await pool.request()
      .input("userId", sql.Int, userId)
      .query("SELECT profile_id FROM UserProfiles WHERE user_id = @userId");
    
    if (profileResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Profile not found for this user' });
    }
    
    const profileId = profileResult.recordset[0].profile_id;
    
    // Now use the existing delete logic with profile_id
    const userprofileModel = require('../models/userprofileModel');
    await userprofileModel.delete(profileId);
    
    res.json({ message: 'Profile deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting profile by user_id:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message 
    });
  }
};

// Export the verify token middleware
exports.verifyToken = verifyToken;
