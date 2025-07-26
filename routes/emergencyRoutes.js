const express = require("express");
const router = express.Router();
const controller = require("../controllers/emergencyController");
const authenticate = require("../../emergency_contact/middlewares/authenticate"); // adjust path if needed
const { validateContact } = require("../middlewares/validateEmergency");

// All routes require authentication
router.use(authenticate);

// CRUD routes
router.get("/", controller.getContacts); // Get all contacts
router.post("/", validateContact, controller.addContact); // Add contact
router.put("/:contactId", validateContact, controller.updateContact); // Update contact
router.delete("/:contactId", controller.deleteContact); // Delete contact

module.exports = router;
