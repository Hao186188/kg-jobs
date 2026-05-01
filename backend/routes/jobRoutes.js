// routes/jobRoutes.js - Phiên bản sửa lỗi
const express = require('express');
const router = express.Router();
const { body, query, validationResult } = require('express-validator');
const Job = require('../models/Job');
const { protect, employerOnly, studentOnly } = require('../middleware/authMiddleware');
const Application = require('../models/Application');

// POST /api/jobs - Đăng tin tuyển dụng
router.post('/', [protect, employerOnly], async (req, res) => {
    try {
        const { 
            title, company, description, requirements, 
            salary, location, majorRequired, jobType, 
            flexibleSchedule, deadline 
        } = req.body;
        
        // Validate required fields
        if (!title || !company || !description || !salary || !deadline) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
            });
        }
        
        const jobData = {
            title,
            company,
            description,
            requirements: requirements || ['Không có yêu cầu cụ thể'],
            salary,
            location: location || { address: 'Rạch Giá, Kiên Giang' },
            majorRequired: majorRequired || 'Không yêu cầu',
            jobType: jobType || 'part-time',
            flexibleSchedule: flexibleSchedule || false,
            deadline: new Date(deadline),
            postedBy: req.user._id,
            isApproved: true,
            isActive: true,
            applicationsCount: 0
        };
        
        const job = new Job(jobData);
        await job.save();
        
        res.status(201).json({
            success: true,
            message: 'Đăng tin tuyển dụng thành công!',
            job
        });
    } catch (error) {
        console.error('Lỗi đăng tin:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Lỗi server khi đăng tin'
        });
    }
});

// GET /api/jobs - Lấy danh sách công việc
router.get('/', async (req, res) => {
    try {
        let { major, flexible, search, page = 1, limit = 10 } = req.query;
        
        let filter = {
            isActive: true,
            isApproved: true,
            deadline: { $gte: new Date() }
        };
        
        if (major && major !== 'all' && major !== 'undefined') {
            filter.majorRequired = major;
        }
        
        if (flexible === 'true') {
            filter.flexibleSchedule = true;
        }
        
        if (search && search !== 'undefined') {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const jobs = await Job.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('postedBy', 'fullName email employerInfo');
        
        const total = await Job.countDocuments(filter);
        
        res.json({
            success: true,
            jobs,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalJobs: total,
                hasMore: parseInt(page) * parseInt(limit) < total
            }
        });
    } catch (error) {
        console.error('Lỗi lấy jobs:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy danh sách việc làm'
        });
    }
});

// GET /api/jobs/:id - Lấy chi tiết công việc
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('postedBy', 'fullName email employerInfo');
        
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy tin tuyển dụng'
            });
        }
        
        res.json({
            success: true,
            job
        });
    } catch (error) {
        console.error('Lỗi lấy chi tiết job:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy chi tiết việc làm'
        });
    }
});

// Sửa lại route POST /:id/apply
router.post('/:id/apply', [protect, studentOnly], async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy công việc'
            });
        }
        
        if (new Date() > job.deadline) {
            return res.status(400).json({
                success: false,
                message: 'Công việc này đã hết hạn ứng tuyển'
            });
        }
        
        // Kiểm tra đã ứng tuyển chưa
        const existingApp = await Application.findOne({
            jobId: req.params.id,
            studentId: req.user._id
        });
        
        if (existingApp) {
            return res.status(400).json({
                success: false,
                message: 'Bạn đã ứng tuyển công việc này rồi'
            });
        }
        
        // Tạo application mới
        const application = await Application.create({
            jobId: req.params.id,
            studentId: req.user._id,
            status: 'pending'
        });
        
        // Tăng số lượng ứng tuyển
        job.applicationsCount = (job.applicationsCount || 0) + 1;
        await job.save();
        
        res.json({
            success: true,
            message: 'Ứng tuyển thành công! Nhà tuyển dụng sẽ liên hệ với bạn.',
            application
        });
    } catch (error) {
        console.error('Lỗi ứng tuyển:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra: ' + error.message
        });
    }
});


// GET /api/jobs/employer/my-jobs - Lấy jobs của employer
router.get('/employer/my-jobs', [protect, employerOnly], async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.user._id })
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            jobs
        });
    } catch (error) {
        console.error('Lỗi lấy jobs của employer:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy danh sách tin của bạn'
        });
    }
});

// DELETE /api/jobs/:id - Xóa tin tuyển dụng
router.delete('/:id', [protect], async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy công việc'
            });
        }
        
        if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền xóa tin này'
            });
        }
        
        await Job.findByIdAndDelete(req.params.id);
        
        res.json({
            success: true,
            message: 'Xóa tin tuyển dụng thành công'
        });
    } catch (error) {
        console.error('Lỗi xóa job:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi xóa tin'
        });
    }
});

module.exports = router;