const express = require('express');
const router = express.Router();
const appointmentsController = require('../controllers/appointmentController');
const authenticate = require('../middlewares/authenticate');

// Routes for managing appointments
router.get('/', authenticate, appointmentsController.getAllAppointments);
router.get('/:id', authenticate, appointmentsController.getAppointmentById);
router.post('/', authenticate, appointmentsController.createAppointment);
router.put('/:id', authenticate, appointmentsController.updateAppointment);
router.delete('/:id', authenticate, appointmentsController.deleteAppointment);

module.exports = router;
