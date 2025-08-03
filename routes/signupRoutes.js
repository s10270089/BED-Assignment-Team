const express = require("express");
const router = express.Router();
const { registerUser, updateUserDetails } = require("../controllers/signupController");

// Step 1: Register user (basic info)
router.post("/", registerUser);

// Step 2: Update user details (birthday, height, weight, etc.)
router.patch("/:userId", updateUserDetails);

// Note: Cloudinary upload is handled in the frontend, no backend upload route needed.
module.exports = router;
