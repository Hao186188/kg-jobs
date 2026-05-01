// models/User.js - KHÔNG DÙNG MIDDLEWARE, xử lý hash thủ công
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email là bắt buộc'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Mật khẩu là bắt buộc'],
        minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
        select: false
    },
    fullName: {
        type: String,
        required: [true, 'Họ tên là bắt buộc'],
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Số điện thoại là bắt buộc']
    },
    role: {
        type: String,
        enum: ['student', 'employer'],
        required: [true, 'Vai trò là bắt buộc']
    },
    avatar: {
        type: String,
        default: 'default-avatar.png'
    },
    studentInfo: {
        studentId: {
            type: String,
            required: function() { return this.role === 'student'; },
            unique: true,
            sparse: true
        },
        major: {
            type: String,
            enum: ['IT', 'Điện', 'Cơ khí', 'Du lịch', 'Kế toán', 'Khác'],
            required: function() { return this.role === 'student'; }
        },
        graduationYear: Number,
        skills: [String]
    },
    employerInfo: {
        companyName: {
            type: String,
            required: function() { return this.role === 'employer'; }
        },
        companyAddress: String,
        taxCode: String,
        verified: {
            type: Boolean,
            default: false
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// KHÔNG CÓ MIDDLEWARE pre('save') Ở ĐÂY

// Method so sánh password
userSchema.methods.comparePassword = async function(enteredPassword) {
    const bcrypt = require('bcryptjs');
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);