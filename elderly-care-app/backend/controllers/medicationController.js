const sql = require("mssql");
const dbConfig = require("../db/dbConfig"); // you'll create this next

exports.getAllMedications = async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query("SELECT * FROM Medications");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Error fetching medications");
  }
};

exports.getMedicationById = async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input("id", sql.Int, req.params.id)
      .query("SELECT * FROM Medications WHERE id = @id");
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send("Error getting medication");
  }
};

exports.createMedication = async (req, res) => {
  const { name, dosage, time, frequency } = req.body;
  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input("name", sql.NVarChar, name)
      .input("dosage", sql.NVarChar, dosage)
      .input("time", sql.NVarChar, time)
      .input("frequency", sql.NVarChar, frequency)
      .query("INSERT INTO Medications (name, dosage, time, frequency) VALUES (@name, @dosage, @time, @frequency)");
    res.send("Medication created");
  } catch (err) {
    res.status(500).send("Error creating medication");
  }
};

exports.updateMedication = async (req, res) => {
  const { name, dosage, time, frequency } = req.body;
  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input("id", sql.Int, req.params.id)
      .input("name", sql.NVarChar, name)
      .input("dosage", sql.NVarChar, dosage)
      .input("time", sql.NVarChar, time)
      .input("frequency", sql.NVarChar, frequency)
      .query("UPDATE Medications SET name=@name, dosage=@dosage, time=@time, frequency=@frequency WHERE id=@id");
    res.send("Medication updated");
  } catch (err) {
    res.status(500).send("Error updating medication");
  }
};

exports.deleteMedication = async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input("id", sql.Int, req.params.id)
      .query("DELETE FROM Medications WHERE id = @id");
    res.send("Medication deleted");
  } catch (err) {
    res.status(500).send("Error deleting medication");
  }
};

//test
