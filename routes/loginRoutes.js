const express = require("express");
const router = express.Router();

const { loginUser } = require("../controller/loginController");
const validateLogin = require("../middleware/validateLogin");

router.post("/", validateLogin, loginUser);

module.exports = router;
