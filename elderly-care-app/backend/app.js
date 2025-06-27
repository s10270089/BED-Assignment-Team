// ---------------------------------------------------
// 1. Load Environment Variables
// ---------------------------------------------------
require("dotenv").config();

// ---------------------------------------------------
// 2. Import Packages
// ---------------------------------------------------
const express = require("express");
const path = require("path");
const sql = require("mssql");
const cors = require("cors"); 

// ---------------------------------------------------
// 3. Initialize Express App
// ---------------------------------------------------
const app = express();
const PORT = process.env.PORT || 3000;

// ---------------------------------------------------
// 4. Middleware Setup
// ---------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Optional for frontend-backend interaction
app.use(express.static(path.join(__dirname, "../frontend"))); // Serve frontend files

// Debug log
console.log("Serving static frontend from:", path.join(__dirname, "../frontend"));

// ---------------------------------------------------
// 5. Database Connection Test (Optional)
// ---------------------------------------------------
sql.connect(require("./db/dbConfig"))
  .then(() => console.log("Connected to SQL Server"))
  .catch((err) => console.error("DB Connection Error:", err));

// ---------------------------------------------------
// 6. API Routes Setup
// ---------------------------------------------------

// Braden – Medication Manager Routes
const medicationRoutes = require("./routes/medicationRoutes");
app.use("/api/medications", medicationRoutes);

// Louis – "Feature X" Routes

// Lee Meng – "Feature Y" Routes

// Osmond – "Feature Y" Routes

// Yoshi – "Feature Y" Routes

// ---------------------------------------------------
// 7. Fallback Route (For Testing)
// ---------------------------------------------------
app.get("/api/health", (req, res) => {
  res.send("CareConnect backend is running.");
});

// ---------------------------------------------------
// 8. Start Server
// ---------------------------------------------------
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

//test