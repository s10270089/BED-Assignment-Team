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
    const record = await Record.getById(req.params.id, req.user.user_id);
    if (!record) return res.status(404).send('Health record not found');
    res.json(record);
  } catch (err) {
    res.status(500).send('Error retrieving health record');
  }
}

exports.createHealthRecord = async (req, res) => {
  try {
    await Record.create({ ...req.body, user_id: req.user.user_id });
    res.send('Health record created');
  } catch (err) {
    res.status(500).send('Error creating health record');
  }
}

exports.updateHealthRecord = async (req, res) => {
  try {
    await Record.update(req.params.id, req.body, req.user.user_id);
    res.send('Health record updated');
  } catch (err) {
    res.status(500).send('Error updating health record');
  }
}

exports.deleteHealthRecord = async (req, res) => {
  try {
    await Record.delete(req.params.id, req.user.user_id);
    res.send('Health record deleted');
  } catch (err) {
    res.status(500).send('Error deleting health record');
  }
}