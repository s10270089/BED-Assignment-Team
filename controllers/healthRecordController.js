const HealthRecord = require('../models/healthrecordModel');

exports.getAllHealthRecords = async (req, res) => {
  try {
    console.log("Decoded token user:", req.user); 

    const records = await HealthRecord.getAll(req.user.user_id);
    res.json(records);
  } catch (err) {
    console.error("Controller Error:", err);
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
    console.log("Received data:", req.body);

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
    console.error("Create Controller Error:", err);
    res.status(500).send('Error creating health record');
  }
};

exports.updateHealthRecord = async (req, res) => {
  try {
    console.log("Updating record with ID:", req.params.id);
    console.log("Received data:", req.body);

    const updatedRows = await HealthRecord.update(req.params.id, req.body, req.user.user_id);

    if (updatedRows === 0) {
      console.log("No record found to update");
      return res.status(404).send("Health record not found or not owned by user");
    }

    res.status(200).send("Health record updated");
  } catch (err) {
    console.error("Edit Controller Error:", err);
    res.status(500).send("Error updating health record");
  }
};

exports.deleteHealthRecord = async (req, res) => {
  try {
    console.log('Deleting record:', req.params.id, 'for user:', req.user?.user_id);
    await HealthRecord.remove(req.params.id, req.user.user_id);
    res.send('Health record deleted');
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).send('Error deleting health record');
  }
}
