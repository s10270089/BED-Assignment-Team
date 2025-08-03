const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');
const authenticate = require('../middlewares/authenticate');
const validateReminder = require('../middlewares/validateReminder');

router.use(authenticate);

router.get('/', authenticate, validateReminder, reminderController.getAllReminders);
router.post('/', validateReminder, reminderController.createReminder);
router.put('/:id', validateReminder, reminderController.updateReminder); 
router.delete('/:id', validateReminder, reminderController.deleteReminder);

module.exports = router;