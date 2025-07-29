const axios = require("axios");
const {
  insertBusSearch,
  insertBusResult,
  insertFavourite,
  getFavourites: fetchFavourites,
  removeFavourite: deleteFavourite
} = require("../models/busModel");

const sql = require("mssql");

async function searchBusArrivals(req, res) {
  const { busStopCode } = req.body;
  const userId = req.user.user_id;

  try {
    const response = await axios.get("https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival", {
      headers: {
        AccountKey: process.env.LTA_API_KEY,
        accept: "application/json"
      },
      params: { BusStopCode: busStopCode }
    });

    const data = response.data;

    if (!data.Services || data.Services.length === 0) {
      return res.status(404).json({ message: "No bus arrival data available." });
    }

    const searchId = await insertBusSearch(userId, busStopCode);

    for (const service of data.Services) {
      const bus = service.NextBus;
      if (bus && bus.EstimatedArrival) {
        const estimatedDate = new Date(bus.EstimatedArrival);
        await insertBusResult(searchId, service.ServiceNo, estimatedDate, bus.Load || "N/A");
      }
    }

    res.status(200).json({
      message: "Bus arrival data fetched and saved.",
      searchId,
      results: data.Services
    });

  } catch (error) {
    console.error("Bus search error:", error.message);
    res.status(500).json({ error: "Failed to fetch bus arrival data." });
  }
}

async function getRecentBusStops(req, res) {
  const userId = req.user.user_id;

  try {
    const result = await sql.query`
      SELECT TOP 5 bus_stop_code 
      FROM BusSearchHistory 
      WHERE user_id = ${userId}
      ORDER BY searched_at DESC
    `;
    const stops = result.recordset.map(r => r.bus_stop_code);
    res.json({ stops });
  } catch (err) {
    console.error("Error fetching recent bus stops:", err);
    res.status(500).json({ error: "Failed to retrieve recent stops." });
  }
}

async function getBusStopName(req, res) {
  const { code } = req.query;
  const headers = { AccountKey: process.env.LTA_API_KEY };
  const endpoint = "https://datamall2.mytransport.sg/ltaodataservice/BusStops";
  let skip = 0;
  const limit = 500; // LTA sends 500 per page

  try {
    while (true) {
      const response = await axios.get(endpoint, {
        headers,
        params: { $skip: skip }
      });

      const results = response.data.value;
      const match = results.find(stop => stop.BusStopCode === code);

      if (match) {
        return res.json({ name: match.Description });
      }

      if (results.length < limit) break; // last page

      skip += limit;
    }

    return res.status(404).json({ error: "Bus stop not found" });

  } catch (err) {
    console.error("LTA error:", err.message);
    return res.status(500).json({ error: "Failed to fetch bus stop name" });
  }
}


async function addFavourite(req, res) {
  const { bus_stop_code, bus_stop_name } = req.body;
  const userId = req.user.user_id;

  try {
    await insertFavourite(userId, bus_stop_code, bus_stop_name);
    res.status(201).json({ message: "Favourite added" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add favourite" });
  }
}

async function handleGetFavourites(req, res) {
  const userId = req.user.user_id;
  try {
    const favourites = await fetchFavourites(userId);
    res.json({ favourites });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch favourites" });
  }
}

async function handleRemoveFavourite(req, res) {
  const userId = req.user.user_id;
  const favId = req.params.id;
  try {
    await deleteFavourite(favId, userId);
    res.json({ message: "Favourite removed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove favourite" });
  }
}

module.exports = {
  searchBusArrivals,
  getRecentBusStops,
  getBusStopName,
  addFavourite,
  handleGetFavourites,
  handleRemoveFavourite
};
