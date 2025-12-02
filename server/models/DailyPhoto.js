const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  dateStr: String, // Format: "DD-MM-YYYY" to easily match frontend
  photoURL: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("DailyPhoto", photoSchema);
