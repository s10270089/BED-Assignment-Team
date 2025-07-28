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
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");

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
const dbConfig = require("./dbConfig.js");

sql.connect(dbConfig)
  .then(() => console.log("Connected to SQL Server"))
  .catch((err) => console.error("Database connection failed:", err));

// ---------------------------------------------------
// Feature Routes Setup
// ---------------------------------------------------

// 🔹 Braden – Medication Manager
const medicationRoutes = require("./routes/medicationRoutes");
app.use("/medications", medicationRoutes);

// 🔹 Braden – User Login & Signup (Authentication)
const signupRoute = require("./routes/signupRoutes");
app.use("/signup", signupRoute);

const loginRoute = require("./routes/loginRoutes");
app.use("/login", loginRoute); // POST /login

// 🔹 Braden – Bus Arrival Info (LTA API Integration)
const busRoutes = require("./routes/busRoutes");
app.use("/bus", busRoutes);

// 🔹 Osmond – Shopping List Manager
const shoplistRoutes = require("./routes/shoplistRoutes");
app.use("/shopping-lists", shoplistRoutes);
// 🔹 Osmond – Emergency Contact Quick Dial
const emergencyRoutes = require('./routes/emergencyRoutes');
app.use('/emergency-contacts', emergencyRoutes);
// 🔹 Yoshi – Event Planner

// Assuming you have an array to hold your events
const eventRoutes = require("./routes/eventRoutes");
app.use("/events", eventRoutes);

// 🔹 Yoshi – Activity Calendar

// 🔹 Louis – Overview Page / Dashboard

// 🔹 Louis – Health Records

// 🔹 Louis – Reminders
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

const reminderRoutes = require('./routes/reminderRoutes');
app.use('/reminders', reminderRoutes);

// 🔹 Lee Meng – User Profile Manager
const userprofileRoutes = require('./routes/userprofileRoutes');
app.use('/userprofiles', userprofileRoutes);

// 🔹 Lee Meng – Workout Plan Organizer
const workoutRoutes = require('./routes/workoutRoutes');
app.use('/api/workouts', workoutRoutes);
// 🔹 Lee Meng – Daily Log Tracker

// ---------------------------------------------------
// Swagger API Documentation
// ---------------------------------------------------
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// ---------------------------------------------------
// Start Server
// ---------------------------------------------------
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
