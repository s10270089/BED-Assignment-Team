const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { findUserByEmail, createGoogleUser, findUserByGoogleId } = require("../models/loginModel");
require("dotenv").config();

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token, user_id: user.user_id});
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
};

exports.findOrCreateGoogleUser = async (profile) => {
  try {
    const existingUser = await findUserByGoogleId(profile.id);

    if (existingUser) {
      return existingUser;
    }

    const name = profile.displayName;
    const email = profile.emails?.[0]?.value || null;

    const newUser = await createGoogleUser(name, email, profile.id);
    return newUser;

  } catch (err) {
    console.error("Google Login Error:", err);
    throw err;
  }
};
