const express = require("express");
const router = express.Router();
const friendController = require("../controllers/friendController");


// More specific routes first
router.get("/friendship-id/:senderId/:receiverId", friendController.getFriendshipId);
router.patch("/requests/:friendshipId/accept", friendController.acceptFriendRequestById);
router.get("/requests/incoming/:userId", friendController.getIncomingRequests);
router.get("/requests/outgoing/:userId", friendController.getOutgoingRequests);
router.post("/requests", friendController.sendRequest);
router.delete("/requests/:friendshipId/reject", friendController.rejectFriendRequestById);
router.delete("/remove/:friendshipId", friendController.removeFriendById);




// This should come last
router.get("/:userId", friendController.getFriends);

module.exports = router;
