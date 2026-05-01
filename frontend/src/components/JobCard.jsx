// components/JobCard.jsx - Phiên bản ổn định, không lỗi
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job, showBadge = true }) => {
    const [showFullDescription, setShowFullDescription] = useState(false);
    
    // Format date
    const formatDate = (date) => {
        const now = new Date();
        const jobDate = new Date(date);
        const diffTime = Math.abs(now - jobDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Hôm nay';
        if (diffDays === 1) return 'Hôm qua';
        return `${diffDays} ngày trước`;
    };
    
    // Check deadline
    const isDeadlineNear = () => {
        const now = new Date();
        const deadline = new Date(job.deadline);
        const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
        return diffDays <= 7 && diffDays > 0;
    };
    
    const isDeadlinePassed = () => {
        const now = new Date();
        const deadline = new Date(job.deadline);
        return now > deadline;
    };
    
    // Format salary
    const formatSalary = (salary) => {
        if (!salary) return 'Thỏa thuận';
        const numbers = salary.match(/\d+/g);
        if (numbers) {
            return salary.replace(/\d+/g, (match) => {
                return parseInt(match).toLocaleString('vi-VN');
            });
        }
        return salary;
    };
    
    // Truncate description
    const truncateDescription = (text, maxLength = 100) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };
    
    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 relative">
            {/* Deadline Passed Badge */}
            {isDeadlinePassed() && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                    Hết hạn
                </div>
            )}
            
            {/* Header */}
            <div className="p-5 border-b border-gray-100">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <Link to={`/jobs/${job._id}`}>
                            <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition line-clamp-1">
                                {job.title}
                            </h3>
                        </Link>
                        <p className="text-gray-600 text-sm">{job.company}</p>
                    </div>
                    {showBadge && job.flexibleSchedule && (
                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap">
                            ⏰ Giờ linh hoạt
                        </span>
                    )}
                </div>
            </div>
            
            {/* Body */}
            <div className="p-5 space-y-3">
                {/* Salary and Location */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                        <span className="text-gray-500 block text-xs mb-1">💰 Mức lương</span>
                        <span className="text-blue-600 font-semibold">
                            {formatSalary(job.salary)}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-500 block text-xs mb-1">📍 Địa điểm</span>
                        <span className="text-gray-700 text-sm truncate block">
                            {job.location?.address || 'Không rõ'}
                        </span>
                    </div>
                </div>
                
                {/* Major */}
                <div>
                    <span className="text-gray-500 block text-xs mb-1">📚 Chuyên ngành</span>
                    <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                        {job.majorRequired}
                    </span>
                </div>
                
                {/* Description */}
                <div>
                    <span className="text-gray-500 block text-xs mb-1">📝 Mô tả</span>
                    <p className="text-gray-600 text-sm">
                        {showFullDescription 
                            ? job.description 
                            : truncateDescription(job.description, 100)
                        }
                        {job.description && job.description.length > 100 && (
                            <button 
                                onClick={() => setShowFullDescription(!showFullDescription)}
                                className="text-blue-600 hover:text-blue-700 ml-1 text-xs font-medium"
                            >
                                {showFullDescription ? 'Thu gọn' : 'Xem thêm'}
                            </button>
                        )}
                    </p>
                </div>
                
                {/* Footer */}
                <div className="flex justify-between items-center pt-3 text-xs border-t border-gray-100">
                    <div className="text-gray-500">
                        📅 Đăng {formatDate(job.createdAt)}
                    </div>
                    <div className={isDeadlineNear() && !isDeadlinePassed() ? 'text-orange-500 font-semibold' : 'text-gray-500'}>
                        ⏰ {isDeadlinePassed() ? 'Đã hết hạn' : `Hạn: ${new Date(job.deadline).toLocaleDateString('vi-VN')}`}
                    </div>
                    <div className="text-gray-500">
                        📝 {job.applicationsCount || 0} đã UT
                    </div>
                </div>
            </div>
            
            {/* Button */}
            <div className="px-5 pb-5">
                <Link 
                    to={`/jobs/${job._id}`}
                    className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                    Xem chi tiết
                </Link>
            </div>
        </div>
    );
};

export default JobCard;