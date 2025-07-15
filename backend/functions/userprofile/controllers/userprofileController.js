// controllers/userprofileController.js
const UserProfile = require("../models/userprofileModel");
const bcrypt = require("bcrypt");

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
