const express = require("express");
const router = express.Router();
const busController = require("../controllers/busController");
const authenticate = require("../middlewares/authenticate");

// Route to get bus arrival data
router.get("/:busStopCode", authenticate, busController.getBusArrivals);

module.exports = router; // ✅ This must be here
