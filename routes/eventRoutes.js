const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");

//events
router.get("/", eventController.getAllEvents);
router.get("/search", eventController.searchEvents);    
router.get("/date", eventController.getEventsByExactDate);
router.post("/", eventController.createEvent);
router.get("/:event_id", eventController.getEventById);
router.get("/user/:user_id", eventController.getEventsByUserId);
router.put("/:event_id", eventController.updateEvent);
router.delete("/:event_id", eventController.deleteEvent);






module.exports = router;

