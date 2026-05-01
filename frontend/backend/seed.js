// seed.js - Thêm dữ liệu mẫu (mô tả ngắn gọn)
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Job = require('./models/Job');

const sampleJobs = [
    {
        title: "Lập trình viên React Part-time",
        company: "ABC Tech",
        description: "Cần tìm lập trình viên React làm việc bán thời gian tại văn phòng Rạch Giá. Ưu tiên sinh viên năm cuối. Thời gian linh hoạt.",
        requirements: ["React.js", "JavaScript", "HTML/CSS"],
        salary: "50.000đ - 70.000đ/giờ",
        location: { address: "Rạch Giá, Kiên Giang" },
        majorRequired: "IT",
        jobType: "part-time",
        flexibleSchedule: true,
        deadline: new Date('2027-12-31'),
        isApproved: true,
        isActive: true
    },
    {
        title: "Trợ giảng Lập trình",
        company: "Trung tâm Tin học KG",
        description: "Hỗ trợ giảng viên dạy lập trình. Thời gian linh hoạt theo lịch học. Phù hợp sinh viên năm 2,3.",
        requirements: ["Kiến thức lập trình cơ bản", "Giao tiếp tốt"],
        salary: "40.000đ/giờ",
        location: { address: "Rạch Giá, Kiên Giang" },
        majorRequired: "IT",
        jobType: "part-time",
        flexibleSchedule: true,
        deadline: new Date('2027-12-31'),
        isApproved: true,
        isActive: true
    },
    {
        title: "Kỹ thuật viên điện",
        company: "Điện Lạnh Kiên Giang",
        description: "Tuyển kỹ thuật viên sửa chữa điện gia dụng. Có xe máy, ưu tiên sinh viên năm cuối.",
        requirements: ["Kiến thức điện cơ bản", "Có xe máy"],
        salary: "35.000đ - 45.000đ/giờ",
        location: { address: "Rạch Giá, Kiên Giang" },
        majorRequired: "Điện",
        jobType: "part-time",
        flexibleSchedule: false,
        deadline: new Date('2027-12-31'),
        isApproved: true,
        isActive: true
    },
    {
        title: "Nhân viên tư vấn du lịch",
        company: "Du Lịch Phú Quốc Express",
        description: "Tư vấn tour cho khách, làm online hoặc offline. Ưu tiên sinh viên ngành Du lịch.",
        requirements: ["Giao tiếp tốt", "Tiếng Anh cơ bản"],
        salary: "30.000đ - 50.000đ/giờ + Hoa hồng",
        location: { address: "Rạch Giá, Kiên Giang" },
        majorRequired: "Du lịch",
        jobType: "part-time",
        flexibleSchedule: true,
        deadline: new Date('2027-12-31'),
        isApproved: true,
        isActive: true
    },
    {
        title: "Nhân viên bán hàng online",
        company: "Shop Thời trang KG",
        description: "Tuyển nhân viên bán hàng online, làm việc tại nhà. Thời gian linh hoạt.",
        requirements: ["Biết dùng Facebook, Zalo", "Chụp ảnh đẹp"],
        salary: "25.000đ - 35.000đ/giờ",
        location: { address: "Online - Rạch Giá" },
        majorRequired: "Không yêu cầu",
        jobType: "part-time",
        flexibleSchedule: true,
        deadline: new Date('2027-12-31'),
        isApproved: true,
        isActive: true
    },
    {
        title: "Pha chế đồ uống",
        company: "Coffee House KG",
        description: "Tuyển nhân viên pha chế, làm việc theo ca. Được đào tạo. Ưu tiên sinh viên.",
        requirements: ["Nhanh nhẹn, thân thiện", "Không yêu cầu kinh nghiệm"],
        salary: "25.000đ/giờ + Tips",
        location: { address: "Trung tâm Rạch Giá" },
        majorRequired: "Không yêu cầu",
        jobType: "part-time",
        flexibleSchedule: true,
        deadline: new Date('2027-12-31'),
        isApproved: true,
        isActive: true
    }
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Kết nối MongoDB thành công');
        
        await User.deleteMany({});
        await Job.deleteMany({});
        console.log('🗑️ Đã xóa dữ liệu cũ');
        
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync('123456', salt);
        
        // Tạo employer
        const employer = await User.create({
            email: 'employer@test.com',
            password: hashedPassword,
            fullName: 'Nguyễn Văn A',
            phone: '0900123456',
            role: 'employer',
            employerInfo: {
                companyName: 'ABC Tech Kiên Giang',
                companyAddress: 'Rạch Giá, Kiên Giang',
                verified: true
            },
            isActive: true
        });
        console.log('✅ Đã tạo employer: employer@test.com');
        
        // Tạo student với email trường
        const student1 = await User.create({
            email: 'student@kiengiangvocational.edu.vn',
            password: hashedPassword,
            fullName: 'Trần Thị B',
            phone: '0900987654',
            role: 'student',
            studentInfo: {
                studentId: 'SV2024001',
                major: 'IT',
                graduationYear: 2026,
                skills: ['JavaScript', 'React']
            },
            isActive: true
        });
        console.log('✅ Đã tạo student (email trường): student@kiengiangvocational.edu.vn');
        
        // Tạo student với Gmail
        const student2 = await User.create({
            email: 'sinhvien@gmail.com',
            password: hashedPassword,
            fullName: 'Nguyễn Văn C',
            phone: '0912345678',
            role: 'student',
            studentInfo: {
                studentId: 'SV2024002',
                major: 'Điện',
                graduationYear: 2026,
                skills: ['Điện dân dụng', 'Sửa chữa']
            },
            isActive: true
        });
        console.log('✅ Đã tạo student (Gmail): sinhvien@gmail.com');
        
        // Thêm jobs
        const jobsWithEmployer = sampleJobs.map(job => ({
            ...job,
            postedBy: employer._id
        }));
        
        await Job.insertMany(jobsWithEmployer);
        console.log(`✅ Đã thêm ${jobsWithEmployer.length} tin tuyển dụng`);
        
        console.log('\n═══════════════════════════════════════');
        console.log('🎉 THÀNH CÔNG! DỮ LIỆU ĐÃ ĐƯỢC KHỞI TẠO');
        console.log('═══════════════════════════════════════');
        console.log('📝 TÀI KHOẢN ĐĂNG NHẬP:');
        console.log('');
        console.log('🏢 NHÀ TUYỂN DỤNG:');
        console.log('   Email: employer@test.com');
        console.log('   Mật khẩu: 123456');
        console.log('');
        console.log('👨‍🎓 SINH VIÊN (Email trường):');
        console.log('   Email: student@kiengiangvocational.edu.vn');
        console.log('   Mật khẩu: 123456');
        console.log('');
        console.log('👨‍🎓 SINH VIÊN (Gmail):');
        console.log('   Email: sinhvien@gmail.com');
        console.log('   Mật khẩu: 123456');
        console.log('═══════════════════════════════════════');
        console.log('\n💡 LƯU Ý: Sinh viên có thể đăng ký bằng Gmail bất kỳ!');
        console.log('📌 Có 6 tin tuyển dụng đã được tạo sẵn để test\n');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ LỖI:', error.message);
        process.exit(1);
    }
}

seedDatabase();