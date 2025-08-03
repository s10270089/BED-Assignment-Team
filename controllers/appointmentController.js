const Appointment = require('../models/appointmentModel');

// Get all appointments for a user
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.getAllAppointments(req.user.user_id);
    res.json(appointments);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).send("Error fetching appointments.");
  }
};

// Get an appointment by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.getAppointmentById(req.params.id, req.user.user_id);
    if (!appointment) return res.status(404).send('Appointment not found');
    res.json(appointment);
  } catch (err) {
    res.status(500).send("Error retrieving appointment");
  }
};

// Create a new appointment
exports.createAppointment = async (req, res) => {
  try {
    // Log the incoming data to check if user_id is received correctly
    console.log("Received user_id:", req.body.user_id);
    await Appointment.createAppointment(req.body);  // Pass the request body to the model
    res.status(201).send('Appointment created successfully');
  } catch (err) {
    res.status(500).send('Error creating appointment');
  }
};

// Update an appointment
exports.updateAppointment = async (req, res) => {
  try {
    await Appointment.updateAppointment(req.params.id, req.body, req.user.user_id);
    res.send('Appointment updated successfully');
  } catch (err) {
    res.status(500).send('Error updating appointment');
  }
};

// Delete an appointment
exports.deleteAppointment = async (req, res) => {
  try {
    await Appointment.deleteAppointment(req.params.id, req.user.user_id);
    res.send('Appointment deleted successfully');
  } catch (err) {
    res.status(500).send('Error deleting appointment');
  }
};
