const express = require("express");
const router = express.Router();

const { loginUser } = require("../controllers/loginController");
const validateLogin = require("../middlewares/validateLogin");

router.post("/", validateLogin, loginUser);

module.exports = router;
