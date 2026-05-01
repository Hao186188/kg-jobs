// components/ManageApplications.jsx - Phiên bản đã sửa lỗi
// Thêm dòng này ở đầu file
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ManageApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState('all');
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchJobsAndApplications();
    }, []);

    const fetchJobsAndApplications = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Lấy danh sách jobs của employer
            const jobsRes = await axios.get('/jobs/employer/my-jobs');
            console.log('Jobs response:', jobsRes.data);
            setJobs(jobsRes.data.jobs || []);
            
            // Lấy danh sách ứng viên
            try {
                const appsRes = await axios.get('/applications/employer/applications');
                console.log('Applications response:', appsRes.data);
                setApplications(appsRes.data.applications || []);
            } catch (appError) {
                console.error('Lỗi lấy applications:', appError);
                setApplications([]);
                if (appError.response?.status === 404) {
                    toast.success('Chưa có ứng viên nào ứng tuyển');
                }
            }
        } catch (error) {
            console.error('Lỗi tải dữ liệu:', error);
            setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
            toast.error('Không thể tải danh sách ứng viên');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (applicationId, status) => {
        try {
            await axios.put(`/applications/${applicationId}/status`, { status });
            toast.success(`Đã ${status === 'accepted' ? 'chấp nhận' : 'từ chối'} ứng viên`);
            await fetchJobsAndApplications(); // Refresh lại danh sách
        } catch (error) {
            console.error('Lỗi cập nhật:', error);
            toast.error(error.response?.data?.message || 'Cập nhật trạng thái thất bại');
        }
    };

    const filteredApplications = selectedJob === 'all' 
        ? applications 
        : applications.filter(app => app.jobId === selectedJob);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Đang tải danh sách ứng viên...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-6xl">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    <strong className="font-bold">Lỗi!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
                <button 
                    onClick={() => fetchJobsAndApplications()}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">📋 Quản lý ứng viên</h1>
                
                {/* Filter by job */}
                {jobs.length > 0 && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Lọc theo công việc</label>
                        <select
                            className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            value={selectedJob}
                            onChange={(e) => setSelectedJob(e.target.value)}
                        >
                            <option value="all">📌 Tất cả công việc</option>
                            {jobs.map(job => (
                                <option key={job._id} value={job._id}>
                                    {job.title} ({job.applicationsCount || 0} ứng viên)
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Thống kê */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600">{applications.length}</p>
                        <p className="text-sm text-gray-600">Tổng số ứng viên</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-yellow-600">
                            {applications.filter(app => app.status === 'pending').length}
                        </p>
                        <p className="text-sm text-gray-600">Đang chờ duyệt</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-green-600">
                            {applications.filter(app => app.status === 'accepted').length}
                        </p>
                        <p className="text-sm text-gray-600">Đã chấp nhận</p>
                    </div>
                </div>

                {/* Applications list */}
                {applications.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <div className="text-6xl mb-4">📭</div>
                        <p className="text-lg">Chưa có ứng viên nào ứng tuyển</p>
                        <p className="text-sm mt-2">Hãy đăng tin tuyển dụng để thu hút ứng viên</p>
                        <Link 
                            to="/dashboard" 
                            className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            + Đăng tin tuyển dụng
                        </Link>
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p>Không có ứng viên cho công việc này</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredApplications.map(app => (
                            <div key={app._id} className="border rounded-lg p-4 hover:shadow-lg transition">
                                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                {app.studentName?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg">{app.studentName}</h3>
                                                <p className="text-gray-600 text-sm">{app.studentEmail}</p>
                                                <p className="text-xs text-blue-600 mt-1">
                                                    Ứng tuyển: {new Date(app.appliedAt).toLocaleString('vi-VN')}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                            <div>
                                                <span className="text-gray-500">🎓 Mã số SV:</span>
                                                <span className="ml-2 font-medium">{app.studentId || 'Chưa cập nhật'}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">📚 Chuyên ngành:</span>
                                                <span className="ml-2 font-medium">{app.major || 'Chưa cập nhật'}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">📞 SĐT:</span>
                                                <span className="ml-2 font-medium">{app.phone || 'Chưa cập nhật'}</span>
                                            </div>
                                        </div>
                                        
                                        {app.skills && app.skills.length > 0 && (
                                            <div className="mt-3">
                                                <span className="text-gray-500 text-sm">🔧 Kỹ năng:</span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {app.skills.map((skill, idx) => (
                                                        <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className="mt-3 text-xs text-gray-400">
                                            📝 Công việc: {app.jobTitle}
                                        </div>
                                    </div>
                                    
                                    <div className="ml-0 md:ml-4">
                                        {app.status === 'pending' ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleUpdateStatus(app._id, 'accepted')}
                                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
                                                >
                                                    👍 Chấp nhận
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(app._id, 'rejected')}
                                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium"
                                                >
                                                    👎 Từ chối
                                                </button>
                                            </div>
                                        ) : (
                                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                                app.status === 'accepted' 
                                                    ? 'bg-green-100 text-green-700' 
                                                    : 'bg-red-100 text-red-700'
                                            }`}>
                                                {app.status === 'accepted' ? '✅ Đã chấp nhận' : '❌ Đã từ chối'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageApplications;