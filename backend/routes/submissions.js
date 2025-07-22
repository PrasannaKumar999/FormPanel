const express = require("express");
const multer = require("multer");
const Submission = require("../models/submission");

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });


router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { name, mobile, address, skills, hobbies } = req.body;
    const photo = req.file?.filename || '';

    const newEntry = new Submission({ name, mobile, address, skills, hobbies, photo });
    await newEntry.save();

    res.status(201).json({ message: 'Saved successfully', data: newEntry });
  } catch (err) {
    console.error('Error saving form:', err);
    res.status(500).json({ error: err.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
