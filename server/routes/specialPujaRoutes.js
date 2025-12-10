// server/routes/specialPujaRoutes.js
const router = require("express").Router();
const SpecialPuja = require("../models/SpecialPuja");

// 1. GET Upcoming Puja
router.get("/upcoming", async (req, res) => {
  try {
    // Find the one marked as upcoming OR the latest future date
    const puja = await SpecialPuja.findOne({ isUpcoming: true });
    res.json(puja);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. CREATE New Special Puja Event (Needed for your Admin Panel)
router.post("/create", async (req, res) => {
  const { pujaType, dateStr } = req.body;
  try {
    // Mark old ones as finished
    await SpecialPuja.updateMany({ isUpcoming: true }, { isUpcoming: false });

    // Create new
    const newPuja = new SpecialPuja({
      pujaType, // "Sankashta" or "Pournami"
      date: new Date(), // Using current date for sorting, dateStr for display
      dateStr,
      isUpcoming: true,
      devotees: [],
    });

    await newPuja.save();
    res.json(newPuja);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. ADD Devotee (Simplified for Admin Panel)
router.post("/add-devotee", async (req, res) => {
  const { name, gothra, nakshatra, phoneNumber, amount } = req.body;
  try {
    const puja = await SpecialPuja.findOne({ isUpcoming: true });
    if (!puja)
      return res
        .status(404)
        .json({ error: "No upcoming special puja active." });

    puja.devotees.push({ name, gothra, nakshatra, phoneNumber, amount });
    await puja.save();
    res.json(puja);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
