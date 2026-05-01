// models/Job.js - ĐÃ SỬA (bỏ giới hạn độ dài)
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Tiêu đề công việc là bắt buộc'],
        trim: true
        // Đã bỏ maxlength
    },
    company: {
        type: String,
        required: [true, 'Tên công ty là bắt buộc'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Mô tả công việc là bắt buộc']
        // Đã bỏ minlength
    },
    requirements: {
        type: [String],
        default: ['Không có yêu cầu cụ thể']
    },
    salary: {
        type: String,
        required: [true, 'Mức lương là bắt buộc']
    },
    location: {
        address: {
            type: String,
            default: 'Rạch Giá, Kiên Giang'
        },
        district: {
            type: String,
            default: 'Rạch Giá'
        },
        city: {
            type: String,
            default: 'Kiên Giang'
        }
    },
    jobType: {
        type: String,
        enum: ['part-time', 'full-time', 'internship', 'freelance'],
        default: 'part-time'
    },
    majorRequired: {
        type: String,
        enum: ['IT', 'Điện', 'Cơ khí', 'Du lịch', 'Kế toán', 'Không yêu cầu'],
        default: 'Không yêu cầu'
    },
    flexibleSchedule: {
        type: Boolean,
        default: false
    },
    deadline: {
        type: Date,
        required: [true, 'Hạn nộp hồ sơ là bắt buộc']
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applicationsCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isApproved: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Job', jobSchema);