require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const urlRoutes = require("./routes/urlRoutes");

const app = express();

// CORS CONFIG (PRODUCTION SAFE)
app.use(
  cors({
    origin: [
      "https://gauravadhikari-linklite.vercel.app",
      "http://localhost:5173" // local development
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HEALTH CHECK (for Render) 
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// DATABASE CONNECTION 
connectDB();

// ROUTES 
app.use("/", urlRoutes);

// HANDLE UNKNOWN ROUTES 
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// START SERVER 
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});