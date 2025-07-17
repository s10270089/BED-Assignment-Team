const sql = require("mssql");

async function insertBusSearch(userId, busStopCode) {
  const result = await sql.query`
    INSERT INTO BusSearchHistory (user_id, bus_stop_code)
    OUTPUT INSERTED.search_id
    VALUES (${userId}, ${busStopCode})
  `;
  return result.recordset[0].search_id;
}

async function insertBusResult(searchId, serviceNo, estimatedArrival, load) {
  await sql.query`
    INSERT INTO BusSearchResults (search_id, service_no, estimated_arrival, load)
    VALUES (${searchId}, ${serviceNo}, ${estimatedArrival}, ${load})
  `;
}

module.exports = {
  insertBusSearch,
  insertBusResult
};
