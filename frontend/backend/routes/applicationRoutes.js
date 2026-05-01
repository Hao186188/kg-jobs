// routes/applicationRoutes.js
const express = require('express');
const router = express.Router();
const { protect, studentOnly, employerOnly } = require('../middleware/authMiddleware');
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');

// GET /api/applications/my-applications - Lấy danh sách ứng tuyển của sinh viên
router.get('/my-applications', [protect, studentOnly], async (req, res) => {
    try {
        const applications = await Application.find({ studentId: req.user._id })
            .populate('jobId', 'title company salary location deadline majorRequired')
            .sort({ appliedAt: -1 });
        
        const formattedApplications = applications.map(app => ({
            _id: app._id,
            jobId: app.jobId._id,
            jobTitle: app.jobId.title,
            company: app.jobId.company,
            salary: app.jobId.salary,
            location: app.jobId.location,
            majorRequired: app.jobId.majorRequired,
            status: app.status,
            appliedAt: app.appliedAt
        }));
        
        res.json({
            success: true,
            applications: formattedApplications
        });
    } catch (error) {
        console.error('Lỗi lấy danh sách ứng tuyển:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy danh sách ứng tuyển'
        });
    }
});

// GET /api/applications/employer/applications - Lấy danh sách ứng viên cho nhà tuyển dụng
router.get('/employer/applications', [protect, employerOnly], async (req, res) => {
    try {
        // Lấy tất cả job của employer
        const jobs = await Job.find({ postedBy: req.user._id });
        const jobIds = jobs.map(job => job._id);
        
        // Lấy tất cả ứng tuyển của các job đó
        const applications = await Application.find({ jobId: { $in: jobIds } })
            .populate('jobId', 'title company')
            .populate('studentId', 'fullName email phone studentInfo')
            .sort({ appliedAt: -1 });
        
        const formattedApplications = applications.map(app => ({
            _id: app._id,
            jobId: app.jobId._id,
            jobTitle: app.jobId.title,
            studentName: app.studentId.fullName,
            studentEmail: app.studentId.email,
            studentId: app.studentId.studentInfo?.studentId || 'Chưa cập nhật',
            major: app.studentId.studentInfo?.major || 'Chưa cập nhật',
            phone: app.studentId.phone,
            skills: app.studentId.studentInfo?.skills || [],
            status: app.status,
            appliedAt: app.appliedAt
        }));
        
        res.json({
            success: true,
            applications: formattedApplications
        });
    } catch (error) {
        console.error('Lỗi lấy danh sách ứng viên:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy danh sách ứng viên'
        });
    }
});

// PUT /api/applications/:id/status - Cập nhật trạng thái ứng tuyển
router.put('/:id/status', [protect, employerOnly], async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findById(req.params.id)
            .populate('jobId');
        
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy ứng tuyển'
            });
        }
        
        // Kiểm tra quyền: chỉ employer của job đó mới được cập nhật
        const job = await Job.findById(application.jobId);
        if (job.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền cập nhật ứng tuyển này'
            });
        }
        
        application.status = status;
        await application.save();
        
        res.json({
            success: true,
            message: `Đã ${status === 'accepted' ? 'chấp nhận' : 'từ chối'} ứng viên`,
            application
        });
    } catch (error) {
        console.error('Lỗi cập nhật trạng thái:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi cập nhật trạng thái'
        });
    }
});

// GET /api/applications/check/:jobId - Kiểm tra đã ứng tuyển chưa
router.get('/check/:jobId', [protect, studentOnly], async (req, res) => {
    try {
        const { jobId } = req.params;
        
        const application = await Application.findOne({
            jobId: jobId,
            studentId: req.user._id
        });
        
        res.json({
            success: true,
            applied: !!application,
            application: application || null
        });
    } catch (error) {
        console.error('Lỗi kiểm tra ứng tuyển:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi kiểm tra ứng tuyển'
        });
    }
});

module.exports = router;