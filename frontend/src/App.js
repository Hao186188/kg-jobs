// App.js - Component chính với đầy đủ routes và tính năng
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import Header from './components/Header';
import JobCard from './components/JobCard';
import EmployerDashboard from './components/EmployerDashboard';
import ProfilePage from './components/ProfilePage';
import MyApplications from './components/MyApplications';
import ManageApplications from './components/ManageApplications';

// Cấu hình axios
axios.defaults.baseURL = 'http://localhost:5000/api';

// Thêm interceptor để tự động thêm token vào mọi request
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Component trang chủ
const HomePage = ({ jobs, loading, onSearch, filters, setFilters }) => {
    const majors = ['all', 'IT', 'Điện', 'Cơ khí', 'Du lịch', 'Kế toán'];
    
    return (
        <div>
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Việc Làm Bán Thời Gian Cho Sinh Viên
                    </h1>
                    <p className="text-xl mb-8 opacity-90">
                        Kết nối việc làm chất lượng tại Kiên Giang
                    </p>
                    
                    <div className="max-w-3xl mx-auto">
                        <div className="flex flex-col md:flex-row gap-3">
                            <input
                                type="text"
                                placeholder="Tìm kiếm công việc hoặc công ty..."
                                className="flex-1 px-5 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                value={filters.search}
                                onChange={(e) => setFilters({...filters, search: e.target.value})}
                                onKeyPress={(e) => e.key === 'Enter' && onSearch()}
                            />
                            <button 
                                onClick={onSearch}
                                className="bg-yellow-500 text-gray-900 px-8 py-3 rounded-lg hover:bg-yellow-600 font-semibold transition"
                            >
                                🔍 Tìm kiếm
                            </button>
                        </div>
                        
                        <div className="mt-4 flex flex-wrap gap-2 justify-center">
                            <label className="flex items-center space-x-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={filters.flexible}
                                    onChange={(e) => setFilters({...filters, flexible: e.target.checked})}
                                    className="rounded"
                                />
                                <span>⏰ Chỉ việc giờ linh hoạt</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Jobs List */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-wrap gap-2 mb-8">
                    {majors.map(major => (
                        <button
                            key={major}
                            onClick={() => setFilters({...filters, major})}
                            className={`px-4 py-2 rounded-full font-medium transition ${
                                filters.major === major 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {major === 'all' ? 'Tất cả' : major}
                        </button>
                    ))}
                </div>
                
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-gray-600">Đang tải việc làm...</p>
                    </div>
                )}
                
                {!loading && (
                    <>
                        {jobs.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">Không tìm thấy công việc phù hợp</p>
                                <button 
                                    onClick={() => {
                                        setFilters({ major: 'all', flexible: false, search: '' });
                                        onSearch();
                                    }}
                                    className="mt-4 text-blue-600 hover:underline"
                                >
                                    Xóa bộ lọc
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {jobs.map(job => (
                                    <JobCard key={job._id} job={job} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

// Component trang tất cả việc làm
const JobsPage = ({ jobs, loading, filters, setFilters, onSearch }) => {
    const majors = ['all', 'IT', 'Điện', 'Cơ khí', 'Du lịch', 'Kế toán'];
    
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Tất cả việc làm</h1>
            
            {/* Search Bar */}
            <div className="mb-6">
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Tìm kiếm công việc..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        value={filters.search}
                        onChange={(e) => setFilters({...filters, search: e.target.value})}
                        onKeyPress={(e) => e.key === 'Enter' && onSearch()}
                    />
                    <button
                        onClick={onSearch}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Tìm
                    </button>
                </div>
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
                {majors.map(major => (
                    <button
                        key={major}
                        onClick={() => setFilters({...filters, major})}
                        className={`px-4 py-2 rounded-full font-medium transition ${
                            filters.major === major 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {major === 'all' ? 'Tất cả' : major}
                    </button>
                ))}
            </div>
            
            {/* Flexible filter */}
            <div className="mb-6">
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={filters.flexible}
                        onChange={(e) => setFilters({...filters, flexible: e.target.checked})}
                        className="rounded"
                        onClick={onSearch}
                    />
                    <span>⏰ Chỉ hiển thị việc làm có giờ linh hoạt</span>
                </label>
            </div>
            
            {/* Jobs list */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Đang tải...</p>
                </div>
            ) : jobs.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-lg">Không tìm thấy công việc phù hợp</p>
                    <button 
                        onClick={() => {
                            setFilters({ major: 'all', flexible: false, search: '' });
                            onSearch();
                        }}
                        className="mt-4 text-blue-600 hover:underline"
                    >
                        Xóa bộ lọc
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map(job => (
                        <JobCard key={job._id} job={job} />
                    ))}
                </div>
            )}
        </div>
    );
};

// Component trang đăng nhập
const LoginPage = ({ setUser }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('/auth/login', formData);
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setUser(response.data.user);
                toast.success('Đăng nhập thành công!');
                navigate('/');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Đăng nhập</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Mật khẩu</label>
                        <input
                            type="password"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                        {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                </form>
                <p className="text-center text-gray-600 mt-4">
                    Chưa có tài khoản? <Link to="/register" className="text-blue-600 hover:underline">Đăng ký</Link>
                </p>
                <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                    <p className="text-xs text-gray-600 text-center">
                        📝 Tài khoản demo:<br/>
                        Sinh viên: sinhvien@gmail.com / 123456<br/>
                        Sinh viên: student@kiengiangvocational.edu.vn / 123456<br/>
                        Nhà tuyển dụng: employer@test.com / 123456
                    </p>
                </div>
            </div>
        </div>
    );
};

// Component trang đăng ký
const RegisterPage = ({ setUser }) => {
    const navigate = useNavigate();
    const [role, setRole] = useState('student');
    const [formData, setFormData] = useState({
        email: '', password: '', fullName: '', phone: '',
        studentInfo: { studentId: '', major: 'IT' },
        employerInfo: { companyName: '' }
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                role,
                ...(role === 'student' && { studentInfo: formData.studentInfo }),
                ...(role === 'employer' && { employerInfo: formData.employerInfo })
            };
            const response = await axios.post('/auth/register', payload);
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setUser(response.data.user);
                toast.success('Đăng ký thành công!');
                navigate('/');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Đăng ký thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Đăng ký</h2>
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setRole('student')}
                        className={`flex-1 py-2 rounded-lg font-semibold transition ${role === 'student' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        Sinh viên
                    </button>
                    <button
                        onClick={() => setRole('employer')}
                        className={`flex-1 py-2 rounded-lg font-semibold transition ${role === 'employer' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        Nhà tuyển dụng
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Họ tên</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            value={formData.fullName}
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                        {role === 'student' && (
                            <p className="text-xs text-gray-500 mt-1">Sử dụng email Gmail hoặc email cá nhân để đăng ký</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Số điện thoại</label>
                        <input
                            type="tel"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Mật khẩu</label>
                        <input
                            type="password"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>
                    {role === 'student' && (
                        <>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Mã số sinh viên</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    value={formData.studentInfo.studentId}
                                    onChange={(e) => setFormData({...formData, studentInfo: {...formData.studentInfo, studentId: e.target.value}})}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Chuyên ngành</label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    value={formData.studentInfo.major}
                                    onChange={(e) => setFormData({...formData, studentInfo: {...formData.studentInfo, major: e.target.value}})}
                                >
                                    <option value="IT">IT</option>
                                    <option value="Điện">Điện</option>
                                    <option value="Cơ khí">Cơ khí</option>
                                    <option value="Du lịch">Du lịch</option>
                                    <option value="Kế toán">Kế toán</option>
                                </select>
                            </div>
                        </>
                    )}
                    {role === 'employer' && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Tên công ty</label>
                            <input
                                type="text"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                value={formData.employerInfo.companyName}
                                onChange={(e) => setFormData({...formData, employerInfo: {companyName: e.target.value}})}
                            />
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                        {loading ? 'Đang xử lý...' : 'Đăng ký'}
                    </button>
                </form>
                <p className="text-center text-gray-600 mt-4">
                    Đã có tài khoản? <Link to="/login" className="text-blue-600 hover:underline">Đăng nhập</Link>
                </p>
            </div>
        </div>
    );
};

// Component trang chi tiết công việc (FIX LỖI)
const JobDetailPage = () => {
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);
    const navigate = useNavigate();
    const jobId = window.location.pathname.split('/').pop();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    
    useEffect(() => {
        const fetchJob = async () => {
            try {
                setLoading(true);
                console.log('Fetching job ID:', jobId);
                
                const response = await axios.get(`/jobs/${jobId}`);
                console.log('Response:', response.data);
                
                if (response.data.success && response.data.job) {
                    setJob(response.data.job);
                } else {
                    toast.error('Không tìm thấy công việc');
                    navigate('/jobs');
                }
            } catch (error) {
                console.error('Lỗi fetch job:', error);
                toast.error('Không thể tải thông tin công việc');
                navigate('/jobs');
            } finally {
                setLoading(false);
            }
        };
        
        if (jobId && jobId !== 'undefined') {
            fetchJob();
        } else {
            toast.error('ID công việc không hợp lệ');
            navigate('/jobs');
        }
    }, [jobId, navigate]);

    const handleApply = async () => {
        if (!token) {
            toast.error('Vui lòng đăng nhập để ứng tuyển');
            navigate('/login');
            return;
        }
        
        if (user.role !== 'student') {
            toast.error('Chức năng này chỉ dành cho sinh viên');
            return;
        }
        
        setApplying(true);
        try {
            const response = await axios.post(`/jobs/${jobId}/apply`);
            if (response.data.success) {
                setApplied(true);
                toast.success('Ứng tuyển thành công! Nhà tuyển dụng sẽ liên hệ với bạn.');
            }
        } catch (error) {
            console.error('Lỗi ứng tuyển:', error);
            if (error.response?.status === 400) {
                if (error.response.data.message === 'Bạn đã ứng tuyển công việc này rồi') {
                    setApplied(true);
                    toast.error('Bạn đã ứng tuyển công việc này rồi');
                } else {
                    toast.error(error.response.data.message);
                }
            } else if (error.response?.status === 401) {
                toast.error('Phiên đăng nhập đã hết hạn');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            } else {
                toast.error(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
            }
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Đang tải thông tin công việc...</p>
            </div>
        );
    }
    
    if (!job) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    Không tìm thấy thông tin công việc
                </div>
                <button 
                    onClick={() => navigate('/jobs')}
                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                    Quay lại danh sách việc làm
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <button 
                onClick={() => navigate(-1)}
                className="mb-4 text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
                ← Quay lại
            </button>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex justify-between items-start mb-4">
                    <h1 className="text-3xl font-bold text-gray-800">{job.title}</h1>
                    {job.flexibleSchedule && (
                        <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
                            ⏰ Linh hoạt
                        </span>
                    )}
                </div>
                <p className="text-gray-600 text-lg mb-6">{job.company}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div><span className="font-semibold">💰 Mức lương:</span> {job.salary}</div>
                    <div><span className="font-semibold">📍 Địa điểm:</span> {job.location?.address || 'Rạch Giá, Kiên Giang'}</div>
                    <div><span className="font-semibold">📚 Chuyên ngành:</span> {job.majorRequired}</div>
                    <div><span className="font-semibold">⏱️ Loại hình:</span> {job.jobType === 'part-time' ? 'Bán thời gian' : 'Thực tập'}</div>
                    <div><span className="font-semibold">📅 Hạn nộp:</span> {new Date(job.deadline).toLocaleDateString('vi-VN')}</div>
                    <div><span className="font-semibold">👥 Ứng tuyển:</span> {job.applicationsCount || 0} người</div>
                </div>
                
                <div className="mb-6">
                    <h3 className="text-xl font-bold mb-3">📝 Mô tả công việc</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
                    </div>
                </div>
                
                <div className="mb-6">
                    <h3 className="text-xl font-bold mb-3">✅ Yêu cầu</h3>
                    <ul className="list-disc list-inside space-y-1">
                        {job.requirements?.map((req, idx) => (
                            <li key={idx} className="text-gray-700">{req}</li>
                        ))}
                    </ul>
                </div>
                
                {new Date(job.deadline) > new Date() ? (
                    <button 
                        onClick={handleApply}
                        disabled={applying || applied}
                        className={`w-full py-3 rounded-lg transition font-semibold ${
                            applied 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                    >
                        {applying ? '⏳ Đang xử lý...' : (applied ? '✅ Đã ứng tuyển' : '📝 Ứng tuyển ngay')}
                    </button>
                ) : (
                    <div className="w-full bg-red-100 text-red-600 text-center py-3 rounded-lg font-semibold">
                        ⚠️ Công việc này đã hết hạn ứng tuyển
                    </div>
                )}
            </div>
        </div>
    );
};

// Component chính App
// Component chính App
function App() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [filters, setFilters] = useState({
        major: 'all',
        flexible: false,
        search: ''
    });
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) {
            const userData = JSON.parse(savedUser);
            setUser(userData);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, []);
    
    const loadJobs = useCallback(async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.major && filters.major !== 'all') params.major = filters.major;
            if (filters.flexible) params.flexible = 'true';
            if (filters.search && filters.search.trim()) params.search = filters.search.trim();
            
            const response = await axios.get('/jobs', { params });
            setJobs(response.data.jobs || []);
        } catch (error) {
            console.error('Lỗi tải jobs:', error);
            toast.error('Không thể tải danh sách việc làm');
            setJobs([]);
        } finally {
            setLoading(false);
        }
    }, [filters.major, filters.flexible, filters.search]);
    
    useEffect(() => {
        loadJobs();
    }, [loadJobs]);
    
    const handleSearch = () => loadJobs();
    
    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        toast.success('Đã đăng xuất');
    };
    
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Toaster position="top-right" />
                <Header user={user} onLogout={handleLogout} />
                
                <Routes>
                    <Route path="/" element={
                        <HomePage 
                            jobs={jobs}
                            loading={loading}
                            onSearch={handleSearch}
                            filters={filters}
                            setFilters={setFilters}
                        />
                    } />
                    <Route path="/jobs" element={
                        <JobsPage 
                            jobs={jobs}
                            loading={loading}
                            filters={filters}
                            setFilters={setFilters}
                            onSearch={handleSearch}
                        />
                    } />
                    <Route path="/login" element={<LoginPage setUser={setUser} />} />
                    <Route path="/register" element={<RegisterPage setUser={setUser} />} />
                    <Route path="/jobs/:id" element={<JobDetailPage />} />
                    <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} />} />
                    <Route path="/my-applications" element={<MyApplications />} />
                    
                    {/* Route cho Quản lý ứng viên - Employer only */}
                    <Route path="/manage-applications" element={
                        user?.role === 'employer' ? 
                            <ManageApplications /> : 
                            <Navigate to="/" />
                    } />
                    
                    <Route path="/dashboard" element={
                        user?.role === 'employer' ? 
                            <EmployerDashboard /> : 
                            <Navigate to="/" />
                    } />
                </Routes>
            </div>
        </Router>
    );
}

export default App;