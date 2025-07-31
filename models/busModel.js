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

async function insertFavourite(userId, code, name) {
  await sql.query`
    INSERT INTO BusFavourites (user_id, bus_stop_code, bus_stop_name)
    VALUES (${userId}, ${code}, ${name})
  `;
}

async function getFavourites(userId) {
  const result = await sql.query`
    SELECT favourite_id, bus_stop_code, bus_stop_name
    FROM BusFavourites
    WHERE user_id = ${userId}
  `;
  return result.recordset;
}

async function removeFavourite(favId, userId) {
  await sql.query`
    DELETE FROM BusFavourites
    WHERE favourite_id = ${favId} AND user_id = ${userId}
  `;
}

module.exports = {
  insertBusSearch,
  insertBusResult,
  insertFavourite,
  getFavourites,
  removeFavourite
};
