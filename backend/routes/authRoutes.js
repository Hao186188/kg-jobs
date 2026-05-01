// routes/authRoutes.js - ĐÃ SỬA (hash thủ công)
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// ĐĂNG KÝ
router.post('/register', [
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
    body('fullName').notEmpty().withMessage('Họ tên là bắt buộc'),
    body('phone').notEmpty().withMessage('Số điện thoại là bắt buộc'),
    body('role').isIn(['student', 'employer']).withMessage('Vai trò không hợp lệ')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        
        const { email, password, fullName, phone, role, studentInfo, employerInfo } = req.body;
        
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'Email đã được đăng ký'
            });
        }
        
        // Hash password thủ công
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const user = await User.create({
            email,
            password: hashedPassword, // Lưu password đã hash
            fullName,
            phone,
            role,
            studentInfo: role === 'student' ? studentInfo : undefined,
            employerInfo: role === 'employer' ? employerInfo : undefined
        });
        
        const token = generateToken(user._id);
        
        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Lỗi đăng ký:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Lỗi server khi đăng ký'
        });
    }
});

// ĐĂNG NHẬP
router.post('/login', [
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('password').notEmpty().withMessage('Mật khẩu là bắt buộc')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        
        const { email, password } = req.body;
        
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email hoặc mật khẩu không đúng'
            });
        }
        
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Email hoặc mật khẩu không đúng'
            });
        }
        
        user.lastLogin = Date.now();
        await user.save();
        
        const token = generateToken(user._id);
        
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi đăng nhập'
        });
    }
});

// PUT /api/auth/profile - Cập nhật profile
router.put('/profile', protect, async (req, res) => {
    try {
        const { fullName, phone, address, bio, studentInfo, employerInfo } = req.body;
        
        const updateData = {
            fullName,
            phone,
            address,
            bio,
            updatedAt: Date.now()
        };
        
        if (req.user.role === 'student' && studentInfo) {
            updateData['studentInfo.major'] = studentInfo.major;
            updateData['studentInfo.graduationYear'] = studentInfo.graduationYear;
            updateData['studentInfo.skills'] = studentInfo.skills;
        }
        
        if (req.user.role === 'employer' && employerInfo) {
            updateData['employerInfo.companyAddress'] = employerInfo.companyAddress;
            updateData['employerInfo.companyPhone'] = employerInfo.companyPhone;
            updateData['employerInfo.companyEmail'] = employerInfo.companyEmail;
            updateData['employerInfo.description'] = employerInfo.description;
        }
        
        const user = await User.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true }
        ).select('-password');
        
        res.json({
            success: true,
            message: 'Cập nhật hồ sơ thành công',
            user
        });
    } catch (error) {
        console.error('Lỗi cập nhật profile:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi cập nhật hồ sơ'
        });
    }
});

router.get('/me', protect, async (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

module.exports = router;