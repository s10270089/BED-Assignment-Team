const bcrypt = require('bcrypt');
const { insertUser, updateUserDetails, updateUserPhoto } = require('../models/signupModel');

// Step 1: Register user (basic info)
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await insertUser({ name, email, hashedPassword });
    res.status(201).json({ 
      message: "Registration successful.", 
      user_id: result.userId,
      profile_id: result.profileId 
    });
  } catch (err) {
    if (err.originalError?.info?.number === 2627 || err.code === "EMAIL_EXISTS") {
      return res.status(400).json({ error: "Email already registered." });
    }
    res.status(500).json({ error: "Registration failed.", details: err.message });
  }
};

// Step 2: Update user details
exports.updateUserDetails = async (req, res) => {
  const userId = req.params.userId;
  const { birthday, height, weight, gender, profile_photo_url } = req.body;
  
  console.log("Received update data:", { userId, birthday, height, weight, gender, profile_photo_url });
  
  try {
    await updateUserDetails(userId, { birthday, height, weight, gender, profile_photo_url });
    res.status(200).json({ message: "User details updated." });
  } catch (err) {
    res.status(500).json({ error: "Failed to update user details.", details: err.message });
  }
};


// Step 3: Update profile photo
exports.updateUserPhoto = async (userId, profile_photo_url) => {
  const pool = await sql.connect(dbConfig);

  return pool.request()
    .input('user_id', sql.Int, userId)
    .input('profile_photo_url', sql.NVarChar, profile_photo_url)
    .query(`
      UPDATE Users
      SET profile_photo_url = @profile_photo_url
      WHERE user_id = @user_id
    `);
};
