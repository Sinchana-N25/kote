const mongoose = require("mongoose");

const devoteeSchema = new mongoose.Schema({
  pujaDay: { type: Number, required: true }, // The day of the month (1-31)
  gothra: String,
  mainDevotee: String,
  nakshatra: String,
  raashi: String,
  phoneNumber: String, // For the WhatsApp link
  familyMembers: [
    {
      name: String,
      nakshatra: String,
      raashi: String,
    },
  ],
});

module.exports = mongoose.model("Devotee", devoteeSchema);
