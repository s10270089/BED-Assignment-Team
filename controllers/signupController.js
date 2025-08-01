const bcrypt = require("bcrypt");
const { insertUser, insertUserProfile } = require("../models/signupModel");

exports.registerUser = async (req, res) => {
  const { name, email, password, birthday } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await insertUser({ name, email, hashedPassword, birthday });

    await insertUserProfile(userId); // Insert default profile for new user

    res.status(201).json({ message: "Registration successful." });
  } catch (err) {
    if (err.originalError?.info?.number === 2627) {
      return res.status(400).json({ error: "Email already registered." });
    }
    res.status(500).json({ error: "Registration failed.", details: err.message });
  }
};
