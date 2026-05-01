// middleware/authMiddleware.js - Xác thực JWT và phân quyền
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware xác thực người dùng qua JWT
 * @param {Object} req - Request object
 * @param {Object} res - Response object  
 * @param {Function} next - Next middleware
 */
const protect = async (req, res, next) => {
    let token;
    
    // Lấy token từ header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Lấy thông tin user (không lấy password)
            req.user = await User.findById(decoded.id).select('-password');
            
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Token không hợp lệ, người dùng không tồn tại'
                });
            }
            
            if (!req.user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Tài khoản đã bị khóa, vui lòng liên hệ quản trị viên'
                });
            }
            
            next();
        } catch (error) {
            console.error('Lỗi xác thực token:', error);
            return res.status(401).json({
                success: false,
                message: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại'
            });
        }
    }
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Không tìm thấy token xác thực'
        });
    }
};

/**
 * Middleware phân quyền: Chỉ cho phép Student
 */
const studentOnly = (req, res, next) => {
    if (req.user && req.user.role === 'student') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Chức năng này chỉ dành cho sinh viên'
        });
    }
};

/**
 * Middleware phân quyền: Chỉ cho phép Employer
 */
const employerOnly = (req, res, next) => {
    if (req.user && req.user.role === 'employer') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Chức năng này chỉ dành cho nhà tuyển dụng'
        });
    }
};

/**
 * Middleware kiểm tra quyền sở hữu tin tuyển dụng
 */
const checkJobOwnership = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);
        
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy tin tuyển dụng'
            });
        }
        
        if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền thao tác với tin tuyển dụng này'
            });
        }
        
        req.job = job;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi kiểm tra quyền sở hữu'
        });
    }
};

module.exports = { protect, studentOnly, employerOnly, checkJobOwnership };