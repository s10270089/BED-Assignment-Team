const express = require("express");
const router = express.Router();
const axios = require("axios");
const sql = require("mssql");
const verifyToken = require("../../middlewares/verifyToken");

router.get("/:busStopCode", verifyToken, async (req, res) => {
  const { busStopCode } = req.params;
  const userId = req.user.user_id;

  try {
    // Fetch from LTA Bus Arrival API
    const response = await axios.get(`http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2`, {
      headers: {
        AccountKey: process.env.LTA_API_KEY,
        accept: "application/json"
      },
      params: { BusStopCode: busStopCode }
    });

    // Log search history
    const pool = await sql.connect();
    await pool.request()
      .input("user_id", sql.Int, userId)
      .input("bus_stop_code", sql.NVarChar, busStopCode)
      .query("INSERT INTO BusSearchHistory (user_id, bus_stop_code) VALUES (@user_id, @bus_stop_code)");

    res.json(response.data.Services); // send relevant services info
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bus arrival info", details: err.message });
  }
});

module.exports = router;
