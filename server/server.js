require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const urlRoutes = require("./routes/urlRoutes");

const app = express();

// middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://your-frontend.vercel.app"
  ]
}));
app.use(express.json());

// connect DB
connectDB();

// routes
app.use("/", urlRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});