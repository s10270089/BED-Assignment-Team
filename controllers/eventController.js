const eventModel = require("../../../models/eventModel");

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

  if (!eventData.user_id || !eventData.title || !eventData.event_time) {
    return res.status(400).json({ message: "user_id, title, and event_time are required." });
  }

  try {
    await eventModel.createEvent(eventData);
    res.status(201).json({ message: "Event created successfully." });
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};
