require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Import Routes
const devoteeRoutes = require("./routes/devoteeRoutes");
const photoRoutes = require("./routes/photoRoutes");

// Use Routes
app.use("/api/devotees", devoteeRoutes);
app.use("/api/photos", photoRoutes);

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Connection Error:", err));

app.get("/", (req, res) => {
  res.send("Temple Server is Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
