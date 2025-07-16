const sql = require("mssql");
const dbConfig = require("../../../db/dbConfig");

exports.saveSearchHistory = async (userId, busStopCode) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input("user_id", sql.Int, userId)
    .input("bus_stop_code", sql.NVarChar, busStopCode)
    .query(`INSERT INTO BusSearchHistory (user_id, bus_stop_code)
            OUTPUT INSERTED.search_id
            VALUES (@user_id, @bus_stop_code)`);
  return result.recordset[0].search_id;
};

exports.saveSearchResult = async (searchId, serviceNo, arrivalTime, load) => {
  const pool = await sql.connect(dbConfig);
  await pool.request()
    .input("search_id", sql.Int, searchId)
    .input("service_number", sql.NVarChar, serviceNo)
    .input("estimated_arrival", sql.DateTime, arrivalTime)
    .input("load", sql.NVarChar, load)
    .query(`INSERT INTO BusSearchResults (search_id, service_number, estimated_arrival, load)
            VALUES (@search_id, @service_number, @estimated_arrival, @load)`);
};
