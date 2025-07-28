const HealthRecord = require('../models/healthrecordModel');

// controllers/healthRecordController.js
exports.getAllHealthRecords = async (req, res) => {
  try {
    console.log("Decoded token user:", req.user); // <-- check this

    const records = await HealthRecord.getAll(req.user.user_id); // pass user_id
    res.json(records);
  } catch (err) {
    console.error("Controller Error:", err); // 👈 this will log the real issue
    res.status(500).send("Error fetching health records");
  }
};


exports.getHealthRecordById = async (req, res) => {
  try {
    const record = await HealthRecord.getById(req.params.id, req.user.user_id);
    if (!record) return res.status(404).send('Health record not found');
    res.json(record);
  } catch (err) {
    res.status(500).send('Error retrieving health record');
  }
}

exports.createHealthRecord = async (req, res) => {
  try {
    const { allergies, diagnosis, doctor_contact, emergency_contact, last_updated } = req.body;
    console.log("Received data:", req.body); // Log incoming request body

    await HealthRecord.create({
      allergies,
      diagnosis,
      doctor_contact,
      emergency_contact,
      last_updated,
      user_id: req.user.user_id
    });

    res.status(201).send('Health record created');
  } catch (err) {
    console.error("Create Controller Error:", err); // Log the specific error
    res.status(500).send('Error creating health record');
  }
};

exports.updateHealthRecord = async (req, res) => {
  try {
    console.log("Updating record with ID:", req.params.id); // Log the record ID
    console.log("Received data:", req.body); // Log the data being sent for update

    const updatedRows = await HealthRecord.update(req.params.id, req.body, req.user.user_id);

    if (updatedRows === 0) {
      console.log("No record found to update"); // If no rows were affected, log that
      return res.status(404).send("Health record not found or not owned by user");
    }

    res.status(200).send("Health record updated");
  } catch (err) {
    console.error("Edit Controller Error:", err); // Log the error
    res.status(500).send("Error updating health record");
  }
};

exports.deleteHealthRecord = async (req, res) => {
  try {
    await HealthRecord.delete(req.params.id, req.user.user_id);
    res.send('Health record deleted');
  } catch (err) {
    res.status(500).send('Error deleting health record');
  }
}