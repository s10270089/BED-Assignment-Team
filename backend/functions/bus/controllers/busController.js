const axios = require("axios");
const { insertBusSearch, insertBusResult } = require("../models/busModel");

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

        await insertBusResult(
          searchId,
          service.ServiceNo,
          estimatedDate, // ✅ now a proper JS Date object
          bus.Load || "N/A"
        );

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

module.exports = { searchBusArrivals };
