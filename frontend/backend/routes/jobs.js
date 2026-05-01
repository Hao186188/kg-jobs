// routes/jobs.js
const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const auth = require('../middleware/auth');

// API POST /api/jobs - Đăng tin (chỉ employer)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ error: 'Chỉ nhà tuyển dụng mới được đăng tin' });
    }
    
    const job = new Job({ ...req.body, postedBy: req.user.id });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API GET /api/jobs - Lọc theo chuyên ngành (student)
router.get('/', async (req, res) => {
  try {
    const { major } = req.query;
    let filter = { isActive: true };
    
    if (major && major !== 'all') {
      filter.majorRequired = major;
    }
    
    const jobs = await Job.find(filter).populate('postedBy', 'name companyName').sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  
});

// Thêm vào routes/jobs.js (nếu sinh viên có gửi kèm tọa độ)
router.get('/nearby', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') return res.status(403).json({ error: 'Chỉ sinh viên' });
    
    const { lat, lng } = req.user.location;
    if (!lat || !lng) return res.json([]);
    
    const jobs = await Job.find({ isActive: true });
    const { markJobNearStudent } = require('../utils/distance');
    const nearJobs = jobs.map(job => markJobNearStudent(job, lat, lng, 5))
                         .filter(job => job.isNear);
    
    res.json(nearJobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;