const Medication = require("../models/medicationModel");

exports.getAllMedications = async (req, res) => {
  try {
    const meds = await Medication.getAll(req.user.user_id);
    res.json(meds);
  } catch (err) {
    res.status(500).send("Error fetching medications");
  }
};

exports.getMedicationById = async (req, res) => {
  try {
    const med = await Medication.getById(req.params.id, req.user.user_id);
    if (!med) return res.status(404).send("Medication not found");
    res.json(med);
  } catch (err) {
    res.status(500).send("Error retrieving medication");
  }
};

exports.createMedication = async (req, res) => {
  try {
    await Medication.create({ ...req.body, user_id: req.user.user_id });
    res.send("Medication created");
  } catch (err) {
    res.status(500).send("Error creating medication");
  }
};

exports.updateMedication = async (req, res) => {
  try {
    await Medication.update(req.params.id, req.body, req.user.user_id);
    res.send("Medication updated");
  } catch (err) {
    res.status(500).send("Error updating medication");
  }
};

exports.deleteMedication = async (req, res) => {
  try {
    await Medication.delete(req.params.id, req.user.user_id);
    res.send("Medication deleted");
  } catch (err) {
    res.status(500).send("Error deleting medication");
  }
};
