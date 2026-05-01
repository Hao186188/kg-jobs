// components/EmployerDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const EmployerDashboard = () => {
    const [myJobs, setMyJobs] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        description: '',
        requirements: [''],
        salary: '',
        location: { address: '', district: 'Rạch Giá', city: 'Kiên Giang' },
        majorRequired: 'IT',
        jobType: 'part-time',
        flexibleSchedule: false,
        deadline: ''
    });

    useEffect(() => {
        fetchMyJobs();
    }, []);

    const fetchMyJobs = async () => {
        try {
            const response = await axios.get('/jobs/employer/my-jobs');
            setMyJobs(response.data.jobs);
        } catch (error) {
            toast.error('Không thể tải danh sách công việc');
        } finally {
            setLoading(false);
        }
    };

    const handlePostJob = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/jobs', {
                ...formData,
                requirements: formData.requirements.filter(r => r.trim())
            });
            toast.success('Đăng tin thành công!');
            setShowForm(false);
            setFormData({
                title: '', company: '', description: '', requirements: [''],
                salary: '', location: { address: '' }, majorRequired: 'IT',
                jobType: 'part-time', flexibleSchedule: false, deadline: ''
            });
            fetchMyJobs();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Đăng tin thất bại');
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (window.confirm('Bạn có chắc muốn xóa tin này?')) {
            try {
                await axios.delete(`/jobs/${jobId}`);
                toast.success('Xóa tin thành công');
                fetchMyJobs();
            } catch (error) {
                toast.error('Xóa tin thất bại');
            }
        }
    };

    const addRequirement = () => {
        setFormData({ ...formData, requirements: [...formData.requirements, ''] });
    };

    const updateRequirement = (index, value) => {
        const newReqs = [...formData.requirements];
        newReqs[index] = value;
        setFormData({ ...formData, requirements: newReqs });
    };

    if (loading) return <div className="text-center py-12">Đang tải...</div>;

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    📊 Dashboard Nhà tuyển dụng
                </h1>
                <button 
                    onClick={() => setShowForm(!showForm)} 
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    {showForm ? '❌ Đóng' : '+ Đăng tin mới'}
                </button>
            </div>

            {/* Form đăng tin */}
            {showForm && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Đăng tin tuyển dụng</h2>
                    <form onSubmit={handlePostJob}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Tiêu đề *"
                                className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Tên công ty *"
                                className="border border-gray-300 p-2 rounded-lg"
                                value={formData.company}
                                onChange={(e) => setFormData({...formData, company: e.target.value})}
                                required
                            />
                            <textarea
                                placeholder="Mô tả công việc *"
                                className="border border-gray-300 p-2 rounded-lg col-span-2"
                                rows="4"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                required
                            />
                            <div className="col-span-2">
                                <label className="block font-semibold mb-2">Yêu cầu công việc:</label>
                                {formData.requirements.map((req, idx) => (
                                    <input
                                        key={idx}
                                        type="text"
                                        placeholder={`Yêu cầu ${idx + 1}`}
                                        className="border border-gray-300 p-2 rounded-lg w-full mb-2"
                                        value={req}
                                        onChange={(e) => updateRequirement(idx, e.target.value)}
                                    />
                                ))}
                                <button type="button" onClick={addRequirement} className="text-blue-600 text-sm">
                                    + Thêm yêu cầu
                                </button>
                            </div>
                            <input
                                type="text"
                                placeholder="Mức lương *"
                                className="border border-gray-300 p-2 rounded-lg"
                                value={formData.salary}
                                onChange={(e) => setFormData({...formData, salary: e.target.value})}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Địa chỉ *"
                                className="border border-gray-300 p-2 rounded-lg"
                                value={formData.location.address}
                                onChange={(e) => setFormData({...formData, location: {...formData.location, address: e.target.value}})}
                                required
                            />
                            <select
                                className="border border-gray-300 p-2 rounded-lg"
                                value={formData.majorRequired}
                                onChange={(e) => setFormData({...formData, majorRequired: e.target.value})}
                            >
                                <option value="IT">IT</option>
                                <option value="Điện">Điện</option>
                                <option value="Cơ khí">Cơ khí</option>
                                <option value="Du lịch">Du lịch</option>
                                <option value="Kế toán">Kế toán</option>
                            </select>
                            <input
                                type="date"
                                className="border border-gray-300 p-2 rounded-lg"
                                value={formData.deadline}
                                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                                required
                            />
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={formData.flexibleSchedule}
                                    onChange={(e) => setFormData({...formData, flexibleSchedule: e.target.checked})}
                                />
                                <span>Giờ làm việc linh hoạt</span>
                            </label>
                        </div>
                        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition mt-4">
                            📤 Đăng tin tuyển dụng
                        </button>
                    </form>
                </div>
            )}

            {/* Danh sách tin đã đăng */}
            <h2 className="text-2xl font-bold mb-4 text-gray-800">📋 Tin đã đăng ({myJobs.length})</h2>
            {myJobs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-500">Bạn chưa đăng tin tuyển dụng nào</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myJobs.map(job => (
                        <div key={job._id} className="bg-white rounded-lg shadow-lg p-5 hover:shadow-xl transition">
                            <h3 className="font-bold text-xl text-gray-800 mb-2">{job.title}</h3>
                            <p className="text-gray-600 text-sm mb-3">Đăng ngày: {new Date(job.createdAt).toLocaleDateString('vi-VN')}</p>
                            <div className="space-y-1 text-sm">
                                <p><span className="font-semibold">💰 Lương:</span> {job.salary}</p>
                                <p><span className="font-semibold">📍 Địa điểm:</span> {job.location?.address}</p>
                                <p><span className="font-semibold">📚 Chuyên ngành:</span> {job.majorRequired}</p>
                                <p><span className="font-semibold">📅 Hạn nộp:</span> {new Date(job.deadline).toLocaleDateString('vi-VN')}</p>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <span className={`text-xs px-2 py-1 rounded ${job.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {job.isActive ? '✅ Đang hiển thị' : '❌ Đã ẩn'}
                                </span>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                    📝 {job.applicationsCount || 0} ứng tuyển
                                </span>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <button 
                                    onClick={() => handleDeleteJob(job._id)}
                                    className="flex-1 bg-red-500 text-white py-1 rounded hover:bg-red-600 text-sm"
                                >
                                    🗑️ Xóa
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EmployerDashboard;