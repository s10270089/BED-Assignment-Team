const express = require("express");
const router = express.Router();
const friendController = require("../controllers/friendController");


// More specific routes first
router.get("/friendship-id/:receiverId", friendController.getFriendshipId);
router.patch("/requests/:friendshipId/accept", friendController.acceptFriendRequestById);
router.get("/requests/incoming/", friendController.getIncomingRequests);
router.get("/requests/outgoing/", friendController.getOutgoingRequests);
router.post("/requests/:receiverId", friendController.sendRequest);
router.delete("/requests/:friendshipId/reject", friendController.rejectFriendRequestById);
router.delete("/remove/:friendshipId", friendController.removeFriendById);




// This should come last
router.get("/", friendController.getFriends);

module.exports = router;
