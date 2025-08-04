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

const fileUpload = require('express-fileupload');
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

// Use express-fileupload middleware
app.use(fileUpload());

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
const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/dashboard', dashboardRoutes);

// 🔹 Louis – Health Records
const healthRecordRoutes = require('./routes/healthRecordRoutes');
app.use('/health-records', healthRecordRoutes);

// 🔹 Louis – Reminders
const reminderRoutes = require('./routes/reminderRoutes');
app.use('/reminders', reminderRoutes);

// 🔹 Lee Meng – User Profile Manager
const userprofileRoutes = require('./routes/userprofileRoutes.js');
app.use('/userprofiles', userprofileRoutes);
// Cloudinary configuration
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Upload image function
const uploadImage = (image) => {
  const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: 'auto',
  };
  
  return new Promise((resolve, reject) => {
    console.log("Starting Cloudinary upload...");
    cloudinary.uploader.upload(image, opts, (error, result) => {
      if (error) {
        console.error("Cloudinary error:", error);
        return reject({ message: error.message || "Cloudinary upload failed" });
      }
      
      if (result && result.secure_url) {
        console.log("Image uploaded successfully:", result.secure_url);
        return resolve(result.secure_url);
      }
      
      console.error("No result or secure_url from Cloudinary");
      return reject({ message: "No secure URL returned from Cloudinary" }); 
    });
  });
};

//const port = 3000;

app.post("/upload-image", async (req, res) => {
  try {
    console.log("Upload request received");
    const { image } = req.body;
    
    if (!image) {
      console.log("No image data provided");
      return res.status(400).json({ error: "No image data provided" });
    }
    
    console.log("Image data preview:", image.substring(0, 100) + "...");
    console.log("Image data length:", image.length);
    
    console.log("Attempting to upload to Cloudinary...");
    const url = await uploadImage(image);
    console.log("Upload successful:", url);
    res.json({ url });
  } catch (err) {
    console.error("Upload error details:", err);
    res.status(500).json({ error: err.message || "Upload failed" });
  }
});

// Test route to verify Cloudinary config
app.get("/test-cloudinary", (req, res) => {
  console.log("Cloudinary config:", {
    cloud_name: cloudinary.config().cloud_name,
    api_key: cloudinary.config().api_key,
    api_secret: cloudinary.config().api_secret ? "***configured***" : "not configured"
  });
  res.json({
    message: "Cloudinary config logged to console",
    config: {
      cloud_name: cloudinary.config().cloud_name,
      api_key: cloudinary.config().api_key,
      api_secret: cloudinary.config().api_secret ? "***configured***" : "not configured"
    }
  });
});

// 🔹 Lee Meng – Workout Plan Organizer
const workoutRoutes = require('./routes/workoutRoutes');
app.use('/workouts', workoutRoutes);
// 🔹 Lee Meng – Daily Log Tracker
const dailylogRoutes = require('./routes/dailylogRoutes');
app.use('/dailylogs', dailylogRoutes);

// ---------------------------------------------------
// Swagger API Documentation
// ---------------------------------------------------
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// ---------------------------------------------------
// Google OAuth Routes
// ---------------------------------------------------
const authRoutes = require('./routes/loginRoutes'); // <-- Make sure this is correct path
app.use('/auth', authRoutes);

// ---------------------------------------------------
// Start Server
// ---------------------------------------------------
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
