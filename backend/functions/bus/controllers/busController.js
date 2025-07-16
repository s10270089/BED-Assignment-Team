const axios = require("axios");
const BusModel = require("../models/busModel");

exports.getBusArrivals = async (req, res) => {
  const { busStopCode } = req.params;
  const userId = req.user.user_id;

  try {
    const response = await axios.get(`https://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${busStopCode}`, {
      headers: {
        AccountKey: process.env.LTA_API_KEY,
        Accept: "application/json",
      },
    });

    const services = response.data.Services;

    // Save to search history
    const searchId = await BusModel.saveSearchHistory(userId, busStopCode);

    // Save each result
    for (const svc of services) {
      const arrivalTime = svc.NextBus?.EstimatedArrival || null;
      const load = svc.NextBus?.Load || null;
      await BusModel.saveSearchResult(searchId, svc.ServiceNo, arrivalTime, load);
    }

    res.json({ services });
  } catch (err) {
    console.error("Bus API error:", err.message);
    res.status(500).json({ error: "Failed to fetch bus data" });
  }
};
