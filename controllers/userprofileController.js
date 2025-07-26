// controllers/userprofileController.js
const UserProfile = require("../models/userprofileModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

function verifyToken(token) {
  try {
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // Contains { user_id, email, iat, exp }
  } catch (error) {
    console.error('Token verification failed:', error);
    return null; // Invalid token
  }
}

exports.getAllUserProfiles = async (req, res) => {
  try {
    const profiles = await UserProfile.getAll();
    res.json(profiles);
  } catch (err) {
    console.error("Error in getAllUserProfiles:", err);
    res.status(500).json({ 
      message: "Error fetching user profiles",
      error: err.message 
    });
  }
};

exports.getUserProfileById = async (req, res) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;
    
    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or missing token' });
    }
    
    console.log("Authenticated user:", decoded.user_id);
    console.log("Getting profile for ID:", req.params.id);
    
    const profile = await UserProfile.getById(req.params.id);
    
    if (!profile) {
      console.log("Profile not found for ID:", req.params.id);
      return res.status(404).json({ message: "User profile not found" });
    }
    
    // Optional: Security check - users can only view their own profile
    // Uncomment if you want this restriction
    /*
    if (profile.user_id !== decoded.user_id) {
      return res.status(403).json({ message: "Access denied. You can only view your own profile." });
    }
    */
    
    console.log("Profile found:", profile);
    res.json(profile);
  } catch (err) {
    console.error("Error in getUserProfileById:", err);
    console.error("Error details:", {
      message: err.message,
      stack: err.stack,
      code: err.code,
      number: err.number
    });
    
    res.status(500).json({ 
      message: "Error retrieving user profile",
      error: err.message 
    });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;
    
    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or missing token' });
    }
    
    console.log("Updating profile ID:", req.params.id);
    console.log("Update data:", req.body);
    
    const profileData = { ...req.body };
    
    // Hash password if provided
    if (profileData.password) {
      const saltRounds = 10;
      profileData.password_hash = await bcrypt.hash(profileData.password, saltRounds);
      delete profileData.password; // Remove plain password
    }

    // Update the profile using the model
    await UserProfile.update(req.params.id, profileData);
    res.send("User profile updated successfully");
    
  } catch (err) {
    console.error("Error updating user profile:", err);
    res.status(500).json({ 
      message: "Error updating user profile",
      error: err.message 
    });
  }
};

exports.deleteUserProfile = async (req, res) => {
  try {
    console.log("Deleting profile ID:", req.params.id);
    await UserProfile.delete(req.params.id);
    res.send("User profile deleted");
  } catch (err) {
    console.error("Error deleting user profile:", err);
    res.status(500).json({ 
      message: "Error deleting user profile",
      error: err.message 
    });
  }
};
