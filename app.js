// ---------------------------------------------------
// Load Environment Variables
// ---------------------------------------------------
require("dotenv").config();

// ---------------------------------------------------
// Import Packages
// ---------------------------------------------------
const express = require("express");
const sql = require("mssql");
const path = require("path");

// ---------------------------------------------------
// Create Express App
// ---------------------------------------------------
const app = express();
const PORT = process.env.PORT || 3000;

// ---------------------------------------------------
// Middleware Setup
// ---------------------------------------------------
const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
// ---------------------------------------------------
// SQL Server Connection
// ---------------------------------------------------
const dbConfig = require("./backend/db/dbConfig.js");

sql.connect(dbConfig)
  .then(() => console.log("Connected to SQL Server"))
  .catch((err) => console.error("Database connection failed:", err));

// ---------------------------------------------------
// Feature Routes Setup
// ---------------------------------------------------

// 🔹 Braden – Medication Manager
const medicationRoutes = require("./backend/functions/medication/routes/medicationRoutes");
app.use("/medications", medicationRoutes);

// 🔹 Braden – User Login & Signup (Authentication)
const signupRoute = require("./backend/functions/signup/routes/signupRoutes");
app.use("/signup", signupRoute);

const loginRoute = require("./backend/functions/login/routes/loginRoutes");
app.use("/login", loginRoute); // POST /login

// 🔹 Braden – Bus Arrival Info (LTA API Integration)
const busRoutes = require("./backend/functions/bus/routes/busRoutes");
app.use("/bus", busRoutes);

// 🔹 Osmond – Shopping List Manager
const shoplistRoutes = require("./backend/functions/shopping_list/routes/shoplistRoutes");
app.use("/shopping-lists", shoplistRoutes);
// 🔹 Osmond – Emergency Contact Quick Dial
const emergencyRoutes = require('./backend/functions/emergency_contact/routes/emergencyRoutes');
app.use('/emergency-contacts', emergencyRoutes);
// 🔹 Yoshi – Event Planner

// Assuming you have an array to hold your events
const eventRoutes = require("./backend/functions/events/routes/eventRoutes");
app.use("/events", eventRoutes);

// 🔹 Yoshi – Activity Calendar

// 🔹 Louis – Overview Page / Dashboard

// 🔹 Louis – Health Records

// 🔹 Louis – Reminders
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

const reminderRoutes = require('./backend/functions/reminder/routes/reminderRoutes');
app.use('/reminders', reminderRoutes);

// 🔹 Lee Meng – User Profile Manager
const userprofileRoutes = require('./backend/functions/userprofile/routes/userprofileRoutes');
app.use('/userprofiles', userprofileRoutes);

// 🔹 Lee Meng – Workout Plan Organizer

// 🔹 Lee Meng – Daily Log Tracker

// ---------------------------------------------------
// Start Server
// ---------------------------------------------------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
