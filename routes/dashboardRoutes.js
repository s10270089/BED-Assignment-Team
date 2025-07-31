const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authenticate = require("../middleware/authenticate");

router.get('/bmi', authenticate, dashboardController.getBMI);
router.get('/user-info', authenticate, dashboardController.getUserInfo);
router.get('/friends', authenticate, dashboardController.getFriendsList);
router.get('/events', authenticate, dashboardController.getUpcomingEvents);

module.exports = router;
