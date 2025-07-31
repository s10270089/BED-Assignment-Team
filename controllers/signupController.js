const bcrypt = require("bcrypt");
const { insertUser } = require("../models/signupModel");

exports.registerUser = async (req, res) => {
  const { name, email, password, birthday, weight, height } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await insertUser({ name, email, hashedPassword, birthday, weight, height });

    res.status(201).json({ message: "Registration successful." });
  } catch (err) {
    if (err.originalError?.info?.number === 2627) {
      return res.status(400).json({ error: "Email already registered." });
    }
    res.status(500).json({ error: "Registration failed.", details: err.message });
  }
};
