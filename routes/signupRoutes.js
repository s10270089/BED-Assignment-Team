const express = require("express");
const router = express.Router();

const { registerUser } = require("../controllers/signupController");
const validateSignup = require("../middlewares/validateSignup");

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
