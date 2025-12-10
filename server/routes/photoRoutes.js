const router = require("express").Router();
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const DailyPhoto = require("../models/DailyPhoto");
const fs = require("fs");
const os = require("os");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Configure Multer to use the Temporary System Folder (/tmp)
// Vercel only allows writing files to /tmp
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, os.tmpdir());
  },
  filename: function (req, file, cb) {
    // Keep original name or add timestamp to avoid duplicates
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// UPLOAD Route
router.post("/upload", upload.single("photo"), async (req, res) => {
  try {
    // 1. Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "temple_photos",
    });

    // 2. Delete local file after upload to save space
    fs.unlinkSync(req.file.path);

    // 3. Save URL to MongoDB with today's date
    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, "0")}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${today.getFullYear()}`;

    // Overwrite if exists, or create new (upsert)
    const savedPhoto = await DailyPhoto.findOneAndUpdate(
      { dateStr: dateStr },
      { photoURL: result.secure_url, dateStr: dateStr },
      { upsert: true, new: true }
    );

    res.json({ success: true, data: savedPhoto });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET Latest Photo Route
router.get("/latest", async (req, res) => {
  try {
    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, "0")}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${today.getFullYear()}`;

    // Try to find today's photo
    let photo = await DailyPhoto.findOne({ dateStr: dateStr });

    // If no photo for today, get the absolute latest one uploaded
    if (!photo) {
      photo = await DailyPhoto.findOne().sort({ createdAt: -1 });
    }

    res.json(photo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
