// components/ProfilePage.jsx - Phiên bản đầy đủ tính năng
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ProfilePage = ({ user, setUser }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        avatar: '',
        bio: '',
        address: '',
        dateOfBirth: '',
        ...(user?.role === 'student' && {
            studentInfo: {
                studentId: '',
                major: 'IT',
                graduationYear: new Date().getFullYear(),
                skills: [],
                bio: '',
                github: '',
                facebook: ''
            }
        }),
        ...(user?.role === 'employer' && {
            employerInfo: {
                companyName: '',
                companyAddress: '',
                companyPhone: '',
                companyEmail: '',
                taxCode: '',
                description: ''
            }
        })
    });

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                phone: user.phone || '',
                avatar: user.avatar || '',
                bio: user.bio || '',
                address: user.address || '',
                dateOfBirth: user.dateOfBirth || '',
                ...(user.role === 'student' && {
                    studentInfo: user.studentInfo || {
                        studentId: '',
                        major: 'IT',
                        graduationYear: new Date().getFullYear(),
                        skills: [],
                        bio: '',
                        github: '',
                        facebook: ''
                    }
                }),
                ...(user.role === 'employer' && {
                    employerInfo: user.employerInfo || {
                        companyName: '',
                        companyAddress: '',
                        companyPhone: '',
                        companyEmail: '',
                        taxCode: '',
                        description: ''
                    }
                })
            });
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.put('/auth/profile', formData);
            if (response.data.success) {
                const updatedUser = { ...user, ...formData };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                setEditing(false);
                toast.success('Cập nhật hồ sơ thành công!');
            }
        } catch (error) {
            console.error('Lỗi cập nhật:', error);
            toast.error(error.response?.data?.message || 'Cập nhật thất bại');
        } finally {
            setLoading(false);
        }
    };

    const addSkill = (skill) => {
        if (skill && !formData.studentInfo.skills.includes(skill)) {
            setFormData({
                ...formData,
                studentInfo: {
                    ...formData.studentInfo,
                    skills: [...formData.studentInfo.skills, skill]
                }
            });
        }
    };

    const removeSkill = (skill) => {
        setFormData({
            ...formData,
            studentInfo: {
                ...formData.studentInfo,
                skills: formData.studentInfo.skills.filter(s => s !== skill)
            }
        });
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Hồ sơ của tôi</h1>
                            <p className="mt-2 opacity-90">Quản lý thông tin cá nhân</p>
                        </div>
                        {!editing && (
                            <button
                                onClick={() => setEditing(true)}
                                className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition font-semibold"
                            >
                                ✏️ Chỉnh sửa
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {!editing ? (
                        // View Mode
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Họ tên</label>
                                    <p className="mt-1 text-lg font-semibold text-gray-900">{formData.fullName}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Email</label>
                                    <p className="mt-1 text-gray-900">{user.email}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Số điện thoại</label>
                                    <p className="mt-1 text-gray-900">{formData.phone || 'Chưa cập nhật'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Địa chỉ</label>
                                    <p className="mt-1 text-gray-900">{formData.address || 'Chưa cập nhật'}</p>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-500">Giới thiệu</label>
                                    <p className="mt-1 text-gray-900">{formData.bio || 'Chưa cập nhật'}</p>
                                </div>
                            </div>

                            {user.role === 'student' && (
                                <>
                                    <div className="border-t pt-6">
                                        <h3 className="text-xl font-bold mb-4">🎓 Thông tin sinh viên</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500">Mã số sinh viên</label>
                                                <p className="mt-1 text-gray-900">{formData.studentInfo?.studentId}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500">Chuyên ngành</label>
                                                <p className="mt-1 text-gray-900">{formData.studentInfo?.major}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500">Năm tốt nghiệp</label>
                                                <p className="mt-1 text-gray-900">{formData.studentInfo?.graduationYear}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500">Kỹ năng</label>
                                                <div className="mt-1 flex flex-wrap gap-2">
                                                    {formData.studentInfo?.skills?.map((skill, idx) => (
                                                        <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {user.role === 'employer' && (
                                <div className="border-t pt-6">
                                    <h3 className="text-xl font-bold mb-4">🏢 Thông tin công ty</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Tên công ty</label>
                                            <p className="mt-1 text-gray-900">{formData.employerInfo?.companyName}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Địa chỉ công ty</label>
                                            <p className="mt-1 text-gray-900">{formData.employerInfo?.companyAddress || 'Chưa cập nhật'}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Điện thoại công ty</label>
                                            <p className="mt-1 text-gray-900">{formData.employerInfo?.companyPhone || 'Chưa cập nhật'}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Email công ty</label>
                                            <p className="mt-1 text-gray-900">{formData.employerInfo?.companyEmail || 'Chưa cập nhật'}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-500">Giới thiệu công ty</label>
                                            <p className="mt-1 text-gray-900">{formData.employerInfo?.description || 'Chưa cập nhật'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Edit Mode
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Họ tên *</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                                    <input
                                        type="tel"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                        value={formData.address}
                                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Giới thiệu về bạn</label>
                                    <textarea
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                        value={formData.bio}
                                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                    />
                                </div>
                            </div>

                            {user.role === 'student' && (
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-bold mb-4">🎓 Thông tin sinh viên</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Mã số sinh viên *</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                                value={formData.studentInfo?.studentId}
                                                disabled
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Chuyên ngành</label>
                                            <select
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                value={formData.studentInfo?.major}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    studentInfo: {...formData.studentInfo, major: e.target.value}
                                                })}
                                            >
                                                <option value="IT">IT</option>
                                                <option value="Điện">Điện</option>
                                                <option value="Cơ khí">Cơ khí</option>
                                                <option value="Du lịch">Du lịch</option>
                                                <option value="Kế toán">Kế toán</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Năm tốt nghiệp</label>
                                            <input
                                                type="number"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                value={formData.studentInfo?.graduationYear}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    studentInfo: {...formData.studentInfo, graduationYear: e.target.value}
                                                })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Kỹ năng</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    id="newSkill"
                                                    placeholder="Thêm kỹ năng"
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            addSkill(e.target.value);
                                                            e.target.value = '';
                                                        }
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const input = document.getElementById('newSkill');
                                                        addSkill(input.value);
                                                        input.value = '';
                                                    }}
                                                    className="bg-blue-600 text-white px-3 py-2 rounded-lg"
                                                >
                                                    Thêm
                                                </button>
                                            </div>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {formData.studentInfo?.skills?.map((skill, idx) => (
                                                    <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm flex items-center gap-1">
                                                        {skill}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeSkill(skill)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {user.role === 'employer' && (
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-bold mb-4">🏢 Thông tin công ty</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Tên công ty *</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                                value={formData.employerInfo?.companyName}
                                                disabled
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ công ty</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                value={formData.employerInfo?.companyAddress}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    employerInfo: {...formData.employerInfo, companyAddress: e.target.value}
                                                })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Điện thoại công ty</label>
                                            <input
                                                type="tel"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                value={formData.employerInfo?.companyPhone}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    employerInfo: {...formData.employerInfo, companyPhone: e.target.value}
                                                })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email công ty</label>
                                            <input
                                                type="email"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                value={formData.employerInfo?.companyEmail}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    employerInfo: {...formData.employerInfo, companyEmail: e.target.value}
                                                })}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Giới thiệu công ty</label>
                                            <textarea
                                                rows="3"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                value={formData.employerInfo?.description}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    employerInfo: {...formData.employerInfo, description: e.target.value}
                                                })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                                >
                                    {loading ? 'Đang lưu...' : '💾 Lưu thay đổi'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditing(false)}
                                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-semibold"
                                >
                                    Hủy
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;