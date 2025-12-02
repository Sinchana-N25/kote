const router = require("express").Router();
const Devotee = require("../models/Devotee");

// GET devotees for TODAY
router.get("/today", async (req, res) => {
  try {
    const today = new Date();
    const dayOfMonth = today.getDate(); // Returns 1-31

    // Find devotees scheduled for this specific day number
    const devotees = await Devotee.find({ pujaDay: dayOfMonth });
    res.json(devotees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST to add a dummy devotee (For testing/seeding)
router.post("/add", async (req, res) => {
  try {
    const newDevotee = new Devotee(req.body);
    const saved = await newDevotee.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
