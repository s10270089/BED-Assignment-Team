const jwt = require("jsonwebtoken");
const eventModel = require("../models/eventModel");
const { getGoogleTokens } = require("../auth/googleAuth");
// controllers/calendarController.js
const { google } = require('googleapis');







//get all events

exports.getAllEvents = async (req, res) => {
  try {
    const events = await eventModel.getAll();
    if (events.length === 0) {
      return res.status(404).json({ message: "No events found." });
    }
    return res.status(200).json({ message: "Events retrieved successfully.", events });
  } catch (err) {
    console.error("Error retrieving events:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

//get authenticated user's events
exports.getEventsForAuthenticatedUser = async (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  let user;

  try {
    user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const userId = user.user_id;

  try {
    const events = await eventModel.getByUserId(userId);  // Filter by user_id
    return res.status(200).json({ events });
  } catch (err) {
    console.error("Error fetching user events:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};


//get event by id

exports.getEventById = async (req, res) => {
  try {
    const event = await eventModel.getById(req.params.event_id);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }
    return res.status(200).json({ message: "Event retrieved successfully.", event });
  } catch (err) {
    console.error("Error retrieving event:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

//get event by user id

exports.getEventsByUserId = async (req, res) => {
  try {
    const events = await eventModel.getByUserId(req.params.user_id);
    if (events.length === 0) {
      return res.status(404).json({ message: "No events found for user." });
    }
    return res.status(200).json({ message: "User's events retrieved successfully.", events });
  } catch (err) {
    console.error("Error retrieving user's events:", err);
    return res.status(500).json({ message: "Internal server error." });
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
    return res.status(200).json({ message: "Event updated successfully." });
  } catch (err) {
    console.error("Error updating event:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

//delete event

exports.deleteEvent = async (req, res) => {
  const event_id = req.params.event_id;

  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token missing or invalid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }

  try {
    // 1. Get Event from DB
    const event = await eventModel.getById(event_id);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    const googleEventId = event.google_id;
    const tokens = await getGoogleTokens(req.user.user_id);

    // 2. If Google Event ID exists, delete from Google Calendar
    if (googleEventId && tokens) {
      try {
        await removeEventsFromGoogleCalendar(tokens, googleEventId);
        console.log("Deleted from Google Calendar:", googleEventId);
      } catch (googleError) {
        console.error("Failed to delete from Google Calendar:", googleError.message);
        // Optional: You may decide whether to proceed deleting from DB if Google Calendar deletion fails.
      }
    }

    // 3. Delete Event from DB
    await eventModel.deleteEvent(event_id);

    return res.status(200).json({ message: "Event deleted successfully." });
  } catch (err) {
    console.error("Error deleting event:", err);
    return res.status(500).json({ message: "Internal server error." });
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
    return res.status(200).json({ message: "Search successful.", events: results });
  } catch (err) {
    console.error("Error searching events:", err);
    return res.status(500).json({ message: "Internal server error." });
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

    return res.status(200).json({ message: "Events for date retrieved.", events });
  } catch (err) {
    console.error("Error retrieving events by date:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};


//create event

exports.createEvent = async (req, res) => {
  const eventData = req.body;

  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token missing or invalid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    eventData.user_id = req.user.user_id;
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }

  console.log("User ID from token:", req.user.user_id);
  const tokens = await getGoogleTokens(req.user.user_id);
  console.log("Tokens retrieved:", tokens);

  console.log("Creating event with data:", eventData);

  if (!eventData.user_id || !eventData.title || !eventData.event_start_time || !eventData.event_end_time) {
    return res.status(400).json({ message: "user_id, title, and event_start/end_time are required." });
  }

  try {
    const event_id = await eventModel.createEvent(eventData);

    // Await and handle Google Calendar Sync Errors
    try {
      const eventGoogleId = await addEventToGoogleCalendar(tokens, eventData);
      console.log("Event added to Google Calendar with ID:", eventGoogleId, "type:", typeof(eventGoogleId));
      if (typeof(eventGoogleId) === 'string') {
        console.log("Event added to Google Calendar with ID:", eventGoogleId);
        // Optionally, you can store the Google event ID in your database if needed
        await eventModel.updateGoogleEventId(event_id, eventGoogleId);
      }
    } catch (googleError) {
      console.error("Failed to sync event with Google Calendar:", googleError.message);
      // Optional: return res.status(500) here if you want to block event creation when Google Calendar fails.
    }

    return res.status(201).json({ message: "Event created successfully." });

  } catch (err) {
    console.error("Error creating event:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};


async function addEventToGoogleCalendar(tokens, eventInput) {
  try {
    const { title, description, location, event_start_time, event_end_time } = eventInput;

    const { google } = require('googleapis');
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'http://localhost:3000/auth/google/callback'
    );

    oauth2Client.setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      scope: 'https://www.googleapis.com/auth/calendar',
      token_type: 'Bearer',
    });

    await oauth2Client.getAccessToken(); // Ensure token is valid

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const startDateTimeISO = new Date(event_start_time).toISOString();
    const endDateTimeISO = new Date(event_end_time).toISOString();

    const event = {
      summary: title,
      description: description,
      location: location,
      start: {
        dateTime: startDateTimeISO,
        timeZone: 'UTC',
      },
      end: {
        dateTime: endDateTimeISO,
        timeZone: 'UTC',
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    console.log('Event added to Google Calendar:', response.data);
    return response.data.id;


  } catch (error) {
    console.error('Error adding event to Google Calendar:', error.message);
    if (error.response && error.response.data) {
      console.error('Google API Error Details:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('No response data from Google API error');
    }
    throw new Error('Failed to add event to Google Calendar');
  }
}


exports.acceptInvitation = async (req, res) => {
  const { invitationId } = req.params;
  try {
    const updated = await eventModel.updateInvitationStatus(invitationId, 'accepted');
    if (updated === 0) {
      return res.status(404).json({ error: 'Invitation not found or already processed' });
    }
    return res.status(200).json({ message: 'Invitation accepted' });
  } catch (err) {
    console.error('Error accepting invitation:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.rejectInvitation = async (req, res) => {
  const { invitationId } = req.params;
  try {
    const updated = await eventModel.updateInvitationStatus(invitationId, 'rejected');
    if (updated === 0) {
      return res.status(404).json({ error: 'Invitation not found or already processed' });
    }
    return res.status(200).json({ message: 'Invitation rejected' });
  } catch (err) {
    console.error('Error rejecting invitation:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

async function removeEventsFromGoogleCalendar(
  tokens,
  eventId
) {
  try {
    const { google } = require('googleapis');
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'http://localhost:3000/auth/google/callback'
    );

    oauth2Client.setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      scope: 'https://www.googleapis.com/auth/calendar',
      token_type: 'Bearer',
    });

    await oauth2Client.getAccessToken(); // Ensure token is valid

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
    });

    console.log('Event deleted from Google Calendar:', eventId);
  } catch (error) {
    console.error('Error deleting event from Google Calendar:', error.message);
    throw new Error('Failed to delete event from Google Calendar');
  }
}





exports.addEventToGoogleCalendar = addEventToGoogleCalendar;
