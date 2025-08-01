const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authenticate = require('../middlewares/authenticate');

// Get dashboard data (BMI, appointments, reminders, events, health records)
router.get('/data', authenticate, dashboardController.getDashboardData);

module.exports = router;
