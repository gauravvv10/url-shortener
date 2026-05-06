require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const urlRoutes = require("./routes/urlRoutes");

const app = express();

/* ───────── CORS ───────── */
const corsOptions = {
  origin: [
    "https://gauravadhikari-linklite.vercel.app",
    "http://localhost:5173",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

/* 🔥 IMPORTANT: handle preflight explicitly */
app.options("*", cors(corsOptions));

/* ───────── MIDDLEWARE ───────── */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ───────── HEALTH CHECK ───────── */
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

/* ───────── DB ───────── */
connectDB();

/* ───────── ROUTES ───────── */
app.use("/", urlRoutes);

/* ───────── 404 ───────── */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ───────── START ───────── */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});