// components/MyApplications.jsx - ĐÃ SỬA (bỏ toast không dùng)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Bỏ import toast vì không dùng
import { Link } from 'react-router-dom';

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (!token || user.role !== 'student') {
            setLoading(false);
            return;
        }
        fetchApplications();
    }, [token, user.role]);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/applications/my-applications');
            setApplications(response.data.applications);
        } catch (error) {
            console.error('Lỗi lấy danh sách ứng tuyển:', error);
            setApplications([]);
        } finally {
            setLoading(false);
        }
    };

    if (!token || user.role !== 'student') {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                    Vui lòng đăng nhập với tài khoản sinh viên để xem danh sách ứng tuyển
                </div>
                <Link to="/login" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition mt-4">
                    Đăng nhập
                </Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Đang tải danh sách...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">📝 Việc làm đã ứng tuyển</h1>
            
            {applications.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <div className="text-6xl mb-4">📭</div>
                    <p className="text-gray-500 text-lg">Bạn chưa ứng tuyển công việc nào</p>
                    <Link to="/jobs" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition mt-4">
                        🔍 Tìm việc ngay
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {applications.map((app, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">
                                        {app.jobTitle || 'Đang cập nhật'}
                                    </h3>
                                    <p className="text-gray-600">{app.company || ''}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                    app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                    app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                    {app.status === 'pending' ? '⏳ Chờ duyệt' :
                                     app.status === 'accepted' ? '✅ Được nhận' :
                                     '❌ Từ chối'}
                                </span>
                            </div>
                            
                            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <span className="text-gray-500">📅 Ngày ứng tuyển:</span>
                                    <span className="ml-2">{new Date(app.appliedAt).toLocaleDateString('vi-VN')}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">💰 Mức lương:</span>
                                    <span className="ml-2">{app.salary || 'Thỏa thuận'}</span>
                                </div>
                            </div>
                            
                            {app.jobId && (
                                <Link 
                                    to={`/jobs/${app.jobId}`}
                                    className="inline-block mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    Xem chi tiết →
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyApplications;