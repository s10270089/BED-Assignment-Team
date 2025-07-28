// controllers/userprofileController.js
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

// Export the verify token middleware
exports.verifyToken = verifyToken;
