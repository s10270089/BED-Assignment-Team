const sql = require("mssql");
const dbConfig = require("../../../db/dbConfig");

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
  const { title, description, location, event_time, invitees } = updatedData;

  const pool = await sql.connect(dbConfig);
  await pool.request()
    .input("event_id", sql.Int, event_id)
    .input("title", sql.NVarChar(100), title)
    .input("description", sql.NVarChar(255), description)
    .input("location", sql.NVarChar(100), location)
    .input("event_time", sql.DateTime, event_time)
    .input("invitees", sql.NVarChar(255), invitees)
    .query(`
      UPDATE Events
      SET title = @title,
          description = @description,
          location = @location,
          event_time = @event_time,
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
      WHERE CAST(event_time AS DATE) = @date
    `);
  return result.recordset;
};


//create event
exports.createEvent = async (eventData) => {
  const { user_id, title, description, location, event_time, invitees } = eventData;
  const pool = await sql.connect(dbConfig);

  await pool.request()
    .input("user_id", sql.Int, user_id)
    .input("title", sql.NVarChar(100), title)
    .input("description", sql.NVarChar(255), description)
    .input("location", sql.NVarChar(100), location)
    .input("event_time", sql.DateTime, event_time)
    .input("invitees", sql.NVarChar(255), invitees)
    .query(`
      INSERT INTO Events (user_id, title, description, location, event_time, invitees)
      VALUES (@user_id, @title, @description, @location, @event_time, @invitees)
    `);
};
