const mongoose = require("mongoose");

const specialPujaSchema = new mongoose.Schema({
  pujaType: { type: String, required: true }, // "Sankashta", "Pournami"
  date: { type: Date, required: true },
  dateStr: String,
  isUpcoming: { type: Boolean, default: true },
  devotees: [
    {
      name: String,
      gothra: String,
      nakshatra: String,
      raashi: String, // Added
      phoneNumber: String,
      amount: { type: Number, default: 101 },
      familyMembers: [
        // Added Nested Array
        {
          name: String,
          raashi: String,
          nakshatra: String,
        },
      ],
    },
  ],
});

module.exports = mongoose.model("SpecialPuja", specialPujaSchema);
