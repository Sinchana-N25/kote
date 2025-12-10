// server/models/SpecialPuja.js
const mongoose = require("mongoose");

const specialPujaSchema = new mongoose.Schema({
  pujaType: { type: String, enum: ["Sankashta", "Pournami"], required: true },
  date: { type: Date, required: true },
  dateStr: String, // "DD-MM-YYYY"
  isUpcoming: { type: Boolean, default: true },
  devotees: [
    {
      name: String,
      gothra: String,
      nakshatra: String,
      phoneNumber: String,
      amount: { type: Number, default: 101 },
    },
  ],
});

module.exports = mongoose.model("SpecialPuja", specialPujaSchema);
