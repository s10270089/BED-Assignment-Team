const model = require("../models/emergencyModel");

// Get all contacts for a user
exports.getContacts = async (req, res) => {
  const userId = req.user.user_id;
  const contacts = await model.getContactsByUser(userId);
  res.json(contacts);
};

// Add a new contact
exports.addContact = async (req, res) => {
  const userId = req.user.user_id;
  const { name, phone_number, relationship } = req.body;
  const contact = await model.addContact(userId, name, phone_number, relationship);
  res.status(201).json(contact);
};

// Update a contact
exports.updateContact = async (req, res) => {
  const { contactId } = req.params;
  const { name, phone_number, relationship } = req.body;
  await model.updateContact(parseInt(contactId), name, phone_number, relationship);
  res.json({ message: "Contact updated" });
};

// Delete a contact
exports.deleteContact = async (req, res) => {
  const { contactId } = req.params;
  await model.deleteContact(parseInt(contactId));
  res.json({ message: "Contact deleted" });
};
