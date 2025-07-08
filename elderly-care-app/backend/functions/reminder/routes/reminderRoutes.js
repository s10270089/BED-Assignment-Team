const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');
const validateReminder = require('../middleware/reminderValidator');
const authenticate = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/', reminderController.getReminders);
router.post('/', validateReminder, reminderController.createReminder);
router.put('/:id', validateReminder, reminderController.updateReminder);
router.delete('/:id', reminderController.deleteReminder);

module.exports = router;
