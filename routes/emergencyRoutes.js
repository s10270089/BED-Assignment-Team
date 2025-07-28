const express = require("express");
const router = express.Router();
const controller = require("../controller/emergencyController");
const authenticate = require("../middleware/authenticate"); // adjust path if needed
const { validateContact } = require("../middleware/validateEmergency");

// All routes require authentication
router.use(authenticate);

// CRUD routes
router.get("/", controller.getContacts); // Get all contacts
router.post("/", validateContact, controller.addContact); // Add contact
router.put("/:contactId", validateContact, controller.updateContact); // Update contact
router.delete("/:contactId", controller.deleteContact); // Delete contact

module.exports = router;
