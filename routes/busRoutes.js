const express = require("express");
const router = express.Router();

const busController = require("../controllers/busController");
const authenticate = require("../middlewares/authenticate");
const validateBusSearch = require("../middlewares/validateBusSearch");

/**
 * @swagger
 * /bus/search:
 *   post:
 *     summary: Search bus arrival timings for a stop
 *     tags: [Bus]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               busStopCode: { type: string }
 *     responses:
 *       200:
 *         description: Bus arrival data
 *       404:
 *         description: No results
 */
router.post("/search", authenticate, validateBusSearch, busController.searchBusArrivals);
router.get("/recent", authenticate, busController.getRecentBusStops);

module.exports = router;
