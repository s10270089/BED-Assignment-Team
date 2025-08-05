const sql = require("mssql");
const dbConfig = require("../dbConfig");

//get event (by id and etc)
exports.getAll = async () => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request().query("SELECT * FROM Events");
  return result.recordset;
};

exports.getById = async (event_id) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input("event_id", sql.Int, event_id)
    .query("SELECT * FROM Events WHERE event_id = @event_id");
  return result.recordset[0]; // return one event
};

exports.getByUserId = async (user_id) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input("user_id", sql.Int, user_id)
    .query("SELECT * FROM Events WHERE user_id = @user_id");
  return result.recordset;
};

//update event
exports.updateEvent = async (event_id, updatedData) => {
  const { title, description, location, date, event_start_time, event_end_time, invitees } = updatedData;

  const startDateTimeObject = new Date(updatedData.event_start_time); // UTC timing, not SG timing
  const endDateTimeObject = new Date(updatedData.event_end_time); // UTC timing, not SG timing
  console.log("startDateTimeObject:", updatedData.event_start_time, "endDateTimeObject:", startDateTimeObject);

  const pool = await sql.connect(dbConfig);
  await pool.request()
    .input("event_id", sql.Int, event_id)
    .input("title", sql.NVarChar(100), title)
    .input("description", sql.NVarChar(255), description)
    .input("location", sql.NVarChar(100), location)
    .input("date", sql.Date, date)
    .input("event_start_time", sql.DateTime, startDateTimeObject)
    .input("event_end_time", sql.DateTime, endDateTimeObject)
    .input("invitees", sql.NVarChar(255), invitees)
    .query(`
      UPDATE Events
      SET title = @title,
          description = @description,
          location = @location,
          date = @date,
          event_start_time = @event_start_time,
          event_end_time = @event_end_time,
          invitees = @invitees
      WHERE event_id = @event_id
    `);

};

//delete event
exports.deleteEvent = async (event_id) => {
  const pool = await sql.connect(dbConfig);
  await pool.request()
    .input("event_id", sql.Int, event_id)
    .query("DELETE FROM Events WHERE event_id = @event_id");
};

//get event by name
exports.searchEvents = async (keyword) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input("keyword", sql.NVarChar, `%${keyword}%`)
    .query(`
      SELECT * FROM Events
      WHERE title LIKE @keyword
         OR description LIKE @keyword
         OR location LIKE @keyword
    `);
  return result.recordset;
};

//get event by date
exports.getByExactDate = async (date) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input("date", sql.Date, date)
    .query(`
      SELECT * FROM Events 
      WHERE CAST(date AS DATE) = @date
    `);
  return result.recordset;
};


//create event
exports.createEvent = async (eventData) => {
  const { user_id, title, description, location, date, event_start_time, event_end_time, invitees } = eventData;

  console.log("eventData:", eventData);
  console.log("eventstarttime:", eventData.event_start_time, "eventendtime:", eventData.event_end_time);
  
  const pool = await sql.connect(dbConfig);

  const startDateTimeObject = new Date(eventData.event_start_time.replace("T", " ")); // local time
  const endDateTimeObject = new Date(eventData.event_end_time.replace("T", " ")); // local time
  console.log("startDateTime:", eventData.event_start_time, "startDateTimeObject:", startDateTimeObject);

  const result = await pool.request()
    .input("user_id", sql.Int, user_id)
    .input("title", sql.NVarChar(100), title)
    .input("description", sql.NVarChar(255), description)
    .input("location", sql.NVarChar(100), location)
    .input("date", sql.Date, date)
    .input("event_start_time", sql.DateTime, startDateTimeObject)  
    .input("event_end_time", sql.DateTime, endDateTimeObject)  
    .input("invitees", sql.NVarChar(255), invitees)
    .query(`
      INSERT INTO Events (user_id, title, description, location, date, event_start_time, event_end_time, invitees)
      OUTPUT INSERTED.event_id
      VALUES (@user_id, @title, @description, @location, @date, @event_start_time, @event_end_time, @invitees)
    `);
  return result.recordset[0].event_id; // returns 1 if inserted successfully
};

exports.updateInvitationStatus = async (invitationId, status) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input('invitationId', sql.Int, invitationId)
    .input('status', sql.NVarChar, status)
    .query(`
      UPDATE EventInvitations
      SET status = @status,
          accepted_at = CASE WHEN @status = 'accepted' THEN GETDATE() ELSE NULL END
      WHERE invitation_id = @invitationId AND status = 'pending'
    `);

  return result.rowsAffected[0]; // returns 1 if updated, 0 if not found
};

exports.updateGoogleEventId = async (eventId, googleEventId) => {
  const pool = await sql.connect(dbConfig);
  await pool.request()
    .input("event_id", sql.Int, eventId)
    .input("google_id", sql.NVarChar(255), googleEventId)
    .query(`
      UPDATE Events
      SET google_id = @google_id
      WHERE event_id = @event_id
    `);
}