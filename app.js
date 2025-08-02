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
const passport = require("passport");
const session = require("express-session");
require("./auth/googleAuth"); // 👈 Google Auth Strategy

// ---------------------------------------------------
// Create Express App
// ---------------------------------------------------
const app = express();
const PORT = process.env.PORT || 3000;

// ---------------------------------------------------
// Middleware Setup
// ---------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const cors = require("cors");
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// 🔐 Session & Passport
app.use(session({
  secret: process.env.SESSION_SECRET || "your-session-secret",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

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
const medicationRoutes = require("./routes/medicationRoutes.js");
app.use("/medications", medicationRoutes);

// 🔹 Braden – User Login & Signup (Authentication)
const signupRoute = require("./routes/signupRoutes");
app.use("/signup", signupRoute);

const loginRoute = require("./routes/loginRoutes");
app.use("/login", loginRoute); // POST /login

// 🔹 Braden – Bus Arrival Info (LTA API Integration)
const busRoutes = require("./routes/busRoutes");
app.use("/bus", busRoutes);
/*
// 🔹 Osmond – Shopping List Manager
const shoplistRoutes = require("./routes/shoplistRoutes");
app.use("/shopping-lists", shoplistRoutes);

// 🔹 Osmond – Emergency Contact Quick Dial
const emergencyRoutes = require('./routes/emergencyRoutes');
app.use('/emergency-contacts', emergencyRoutes);

// 🔹 Yoshi – Friendship manager
const friendRoutes = require("./routes/friendRoutes");
app.use("/friends", friendRoutes);

// 🔹 Yoshi – Event Planner
const eventRoutes = require("./routes/eventRoutes");
app.use("/events", eventRoutes);

// 🔹 Louis – Appointments
const appointmentRoutes = require('./routes/appointmentRoutes');
app.use('/appointments', appointmentRoutes);

// 🔹 Louis – Overview Page / Dashboard

// 🔹 Louis – Health Records
const healthRecordRoutes = require('./routes/healthRecordRoutes');
app.use('/health-records', healthRecordRoutes);

// 🔹 Louis – Reminders
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const reminderRoutes = require('./routes/reminderRoutes');
app.use('/reminders', reminderRoutes);

// 🔹 Lee Meng – User Profile Manager
const userprofileRoutes = require('./routes/userprofileRoutes.js');
app.use('/userprofiles', userprofileRoutes);

// ---------------------------------------------------
// Swagger API Documentation
// ---------------------------------------------------
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// ---------------------------------------------------
// Google OAuth Routes
// ---------------------------------------------------
app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login.html",
    session: false,
  }),
  (req, res) => {
    res.redirect("/dashboard.html"); // ✅ Successful login redirect
  }
);

// ---------------------------------------------------
// Start Server
// ---------------------------------------------------
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
