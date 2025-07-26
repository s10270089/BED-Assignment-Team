const express = require("express");
const router = express.Router();
const controller = require("./friendController");

// Routes
router.get("/friends/:userId", controller.getFriends);
router.get("/requests/incoming/:userId", controller.getIncomingRequests);
router.get("/requests/outgoing/:userId", controller.getOutgoingRequests);
router.post("/requests", controller.sendRequest);
router.put("/requests/:friendshipId", controller.updateStatus);

module.exports = router;
