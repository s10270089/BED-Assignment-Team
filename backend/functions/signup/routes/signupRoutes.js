const express = require("express");
const router = express.Router();

const { registerUser } = require("../controllers/signupController");
const validateSignup = require("../middlewares/validateSignup");

router.post("/", validateSignup, registerUser);

module.exports = router;
