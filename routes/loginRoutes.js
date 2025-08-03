const express = require("express");
const passport = require("passport");
const router = express.Router();

const { loginUser } = require("../controllers/loginController");
const validateLogin = require("../middlewares/validateLogin");

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
router.post("/", validateLogin, loginUser);

// Google login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: "/login.html" }),
  (req, res) => {
    const token = req.user.token;
    res.redirect(`/login.html?token=${token}`);
  }
);

module.exports = router;
