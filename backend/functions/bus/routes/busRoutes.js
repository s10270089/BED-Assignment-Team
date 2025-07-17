const express = require("express");
const router = express.Router();

const busController = require("../controllers/busController");
const authenticate = require("../middlewares/authenticate");
const validateBusSearch = require("../middlewares/validateBusSearch");

router.post("/search", authenticate, validateBusSearch, busController.searchBusArrivals);

module.exports = router;
