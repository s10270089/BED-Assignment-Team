const express = require("express");
const router = express.Router();

const { registerUser } = require("../controller/signupController");
const validateSignup = require("../middleware/validateSignup");

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Signup]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               birthday: { type: string, format: date }
 *     responses:
 *       201:
 *         description: User registered
 */
router.post("/", validateSignup, registerUser);

module.exports = router;
