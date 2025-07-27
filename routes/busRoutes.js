const express = require("express");
const router = express.Router();

const busController = require("../controller/busController");
const authenticate = require("../middleware/authenticate");
const validateBusSearch = require("../middleware/validateBusSearch");

router.post("/search", authenticate, validateBusSearch, busController.searchBusArrivals);

module.exports = router;
