const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");

//events
router.get("/", eventController.getAllEvents);
router.get("/search", eventController.searchEvents);    
router.get("/date", eventController.getEventsByExactDate);
// Accept invitation
router.patch('/:invitationId/accept', eventController.acceptInvitation);

// Reject invitation
router.patch('/:invitationId/reject', eventController.rejectInvitation);

router.post("/", eventController.createEvent);
router.get("/:event_id", eventController.getEventById);
router.get("/user/:user_id", eventController.getEventsByUserId);
router.put("/:event_id", eventController.updateEvent);
router.delete("/:event_id", eventController.deleteEvent);






module.exports = router;

