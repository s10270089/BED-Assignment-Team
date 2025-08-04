const jwt = require("jsonwebtoken");
const eventModel = require("../models/eventModel");

//get all events

exports.getAllEvents = async (req, res) => {
  try {
    const events = await eventModel.getAll();
    if (events.length === 0) {
      return res.status(404).json({ message: "No events found." });
    }
    res.status(200).json({ message: "Events retrieved successfully.", events });
  } catch (err) {
    console.error("Error retrieving events:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

//get event by id

exports.getEventById = async (req, res) => {
  try {
    const event = await eventModel.getById(req.params.event_id);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }
    res.status(200).json({ message: "Event retrieved successfully.", event });
  } catch (err) {
    console.error("Error retrieving event:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

//get event by user id

exports.getEventsByUserId = async (req, res) => {
  try {
    const events = await eventModel.getByUserId(req.params.user_id);
    if (events.length === 0) {
      return res.status(404).json({ message: "No events found for user." });
    }
    res.status(200).json({ message: "User's events retrieved successfully.", events });
  } catch (err) {
    console.error("Error retrieving user's events:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

//update event

exports.updateEvent = async (req, res) => {
  const event_id = req.params.event_id;
  const updatedData = req.body;

console.log(req.params);

//  console.log("Updating event with ID:", event_id, "with data:", updatedData);

  try {
    await eventModel.updateEvent(event_id, updatedData);
    res.status(200).json({ message: "Event updated successfully." });
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

//delete event

exports.deleteEvent = async (req, res) => {
  const event_id = req.params.event_id;

  try {
    await eventModel.deleteEvent(event_id);
    res.status(200).json({ message: "Event deleted successfully." });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

//search for event by name

exports.searchEvents = async (req, res) => {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({ message: "Keyword is required." });
  }

  try {
    const results = await eventModel.searchEvents(keyword);
    if (results.length === 0) {
      return res.status(404).json({ message: "No events found matching the search." });
    }
    res.status(200).json({ message: "Search successful.", events: results });
  } catch (err) {
    console.error("Error searching events:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

//search for event by date

exports.getEventsByExactDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: "date is required (YYYY-MM-DD)" });
    }

    const events = await eventModel.getByExactDate(date);
    if (events.length === 0) {
      return res.status(404).json({ message: "No events found on that date." });
    }

    res.status(200).json({ message: "Events for date retrieved.", events });
  } catch (err) {
    console.error("Error retrieving events by date:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};


//create event

exports.createEvent = async (req, res) => {
  const eventData = req.body;

  // Ensure the user_id is extracted from the JWT token
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token missing or invalid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    eventData.user_id = req.user.user_id;  // Set user_id from the decoded token
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }

  console.log("Creating event with data:", eventData);

  if (!eventData.user_id || !eventData.title || !eventData.event_start_time || !eventData.event_end_time) {
    return res.status(400).json({ message: "user_id, title, and event_start/end_time are required." });
  }

  try {
    await eventModel.createEvent(eventData);
    res.status(201).json({ message: "Event created successfully." });
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};


exports.acceptInvitation = async (req, res) => {
  const { invitationId } = req.params;
  try {
    const updated = await eventModel.updateInvitationStatus(invitationId, 'accepted');
    if (updated === 0) {
      return res.status(404).json({ error: 'Invitation not found or already processed' });
    }
    res.status(200).json({ message: 'Invitation accepted' });
  } catch (err) {
    console.error('Error accepting invitation:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.rejectInvitation = async (req, res) => {
  const { invitationId } = req.params;
  try {
    const updated = await eventModel.updateInvitationStatus(invitationId, 'rejected');
    if (updated === 0) {
      return res.status(404).json({ error: 'Invitation not found or already processed' });
    }
    res.status(200).json({ message: 'Invitation rejected' });
  } catch (err) {
    console.error('Error rejecting invitation:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};