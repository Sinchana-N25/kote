// server/routes/specialPujaRoutes.js
const router = require("express").Router();
const SpecialPuja = require("../models/SpecialPuja");

// GET: Fetch upcoming Special Puja and its devotees
router.get("/upcoming", async (req, res) => {
  try {
    const today = new Date();
    // Find the next upcoming Sankashta (or Pournami)
    const upcomingPuja = await SpecialPuja.findOne({
      date: { $gte: today },
    }).sort({ date: 1 });
    res.json(upcomingPuja);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Register a new devotee for the upcoming puja
router.post("/register/:pujaId", async (req, res) => {
  try {
    const { name, gothra, nakshatra, phoneNumber } = req.body;

    const updatedPuja = await SpecialPuja.findByIdAndUpdate(
      req.params.pujaId,
      { $push: { devotees: { name, gothra, nakshatra, phoneNumber } } },
      { new: true, runValidators: true }
    );

    if (!updatedPuja)
      return res.status(404).json({ message: "Puja not found." });

    res.json(updatedPuja);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
