const express = require("express");
const router = express.Router();

const { registerUser } = require("../controller/signupController");
const validateSignup = require("../middleware/validateSignup");

router.post("/", validateSignup, registerUser);

module.exports = router;
