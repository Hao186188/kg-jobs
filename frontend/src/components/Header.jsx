// components/Header.jsx - Header với đầy đủ tính năng và dropdown đẹp
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (onLogout) onLogout();
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
        navigate('/');
        setTimeout(() => {
            window.location.reload();
        }, 100);
    };
    
    const getInitials = (name) => {
        if (!name) return 'U';
        return name.charAt(0).toUpperCase();
    };
    
    const isActive = (path) => {
        return location.pathname === path ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600';
    };
    
    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition">
                            <span className="text-white font-bold text-xl">KG</span>
                        </div>
                        <div>
                            <span className="text-xl font-bold text-gray-800">
                                KG-Jobs
                            </span>
                            <span className="text-xs text-blue-600 ml-1">Beta</span>
                        </div>
                    </Link>
                    
                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className={`${isActive('/')} transition font-medium`}>
                            🏠 Trang chủ
                        </Link>
                        <Link to="/jobs" className={`${isActive('/jobs')} transition font-medium`}>
                            💼 Việc làm
                        </Link>
                        
                        {user ? (
                            <>
                                {user.role === 'employer' && (
                                    <>
                                        <Link to="/dashboard" className={`${isActive('/dashboard')} transition font-medium`}>
                                            📊 Dashboard
                                        </Link>
                                        <Link to="/manage-applications" className={`${isActive('/manage-applications')} transition font-medium`}>
                                            👥 Quản lý ứng viên
                                        </Link>
                                    </>
                                )}
                                {user.role === 'student' && (
                                    <Link to="/my-applications" className={`${isActive('/my-applications')} transition font-medium`}>
                                        📝 Đã ứng tuyển
                                    </Link>
                                )}
                                
                                {/* User Dropdown */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition focus:outline-none"
                                    >
                                        <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                                            <span className="text-white font-semibold text-sm">
                                                {getInitials(user.fullName)}
                                            </span>
                                        </div>
                                        <span className="font-medium">{user.fullName?.split(' ')[0]}</span>
                                        <svg className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    
                                    {/* Dropdown Menu */}
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border overflow-hidden z-50 animate-fadeIn">
                                            {/* User Info */}
                                            <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                                                        <span className="text-white font-bold text-lg">
                                                            {getInitials(user.fullName)}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-bold text-gray-800">{user.fullName}</p>
                                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                        <p className="text-xs text-blue-600 mt-1">
                                                            {user.role === 'student' ? '🎓 Sinh viên' : '🏢 Nhà tuyển dụng'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Menu Items */}
                                            <div className="py-2">
                                                <Link
                                                    to="/profile"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                    className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition group"
                                                >
                                                    <span className="text-xl mr-3">👤</span>
                                                    <div>
                                                        <p className="font-medium">Hồ sơ của tôi</p>
                                                        <p className="text-xs text-gray-400">Xem và cập nhật thông tin</p>
                                                    </div>
                                                </Link>
                                                
                                                {user.role === 'student' && (
                                                    <Link
                                                        to="/my-applications"
                                                        onClick={() => setIsDropdownOpen(false)}
                                                        className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition group"
                                                    >
                                                        <span className="text-xl mr-3">📝</span>
                                                        <div>
                                                            <p className="font-medium">Việc đã ứng tuyển</p>
                                                            <p className="text-xs text-gray-400">Theo dõi trạng thái ứng tuyển</p>
                                                        </div>
                                                    </Link>
                                                )}
                                                
                                                {user.role === 'employer' && (
                                                    <>
                                                        <Link
                                                            to="/dashboard"
                                                            onClick={() => setIsDropdownOpen(false)}
                                                            className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition group"
                                                        >
                                                            <span className="text-xl mr-3">📊</span>
                                                            <div>
                                                                <p className="font-medium">Dashboard</p>
                                                                <p className="text-xs text-gray-400">Quản lý tin tuyển dụng</p>
                                                            </div>
                                                        </Link>
                                                        <Link
                                                            to="/manage-applications"
                                                            onClick={() => setIsDropdownOpen(false)}
                                                            className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition group"
                                                        >
                                                            <span className="text-xl mr-3">👥</span>
                                                            <div>
                                                                <p className="font-medium">Quản lý ứng viên</p>
                                                                <p className="text-xs text-gray-400">Xem và phản hồi ứng viên</p>
                                                            </div>
                                                        </Link>
                                                    </>
                                                )}
                                                
                                                <div className="border-t my-1"></div>
                                                
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center w-full px-4 py-2.5 text-red-600 hover:bg-red-50 transition group"
                                                >
                                                    <span className="text-xl mr-3">🚪</span>
                                                    <div>
                                                        <p className="font-medium">Đăng xuất</p>
                                                        <p className="text-xs text-gray-400">Thoát khỏi tài khoản</p>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link to="/login" className="text-gray-700 hover:text-blue-600 transition font-medium">
                                    Đăng nhập
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition shadow-md hover:shadow-lg"
                                >
                                    Đăng ký
                                </Link>
                            </div>
                        )}
                    </div>
                    
                    {/* Mobile menu button */}
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
                
                {/* Mobile Menu - Cải thiện */}
                {isMobileMenuOpen && (
                    <div className="md:hidden mt-4 space-y-2 pb-4 border-t pt-4 animate-slideDown">
                        <Link 
                            to="/" 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
                        >
                            🏠 Trang chủ
                        </Link>
                        <Link 
                            to="/jobs" 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
                        >
                            💼 Việc làm
                        </Link>
                        
                        {user ? (
                            <>
                                {user.role === 'employer' && (
                                    <>
                                        <Link 
                                            to="/dashboard" 
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
                                        >
                                            📊 Dashboard
                                        </Link>
                                        <Link 
                                            to="/manage-applications" 
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
                                        >
                                            👥 Quản lý ứng viên
                                        </Link>
                                    </>
                                )}
                                
                                {user.role === 'student' && (
                                    <Link 
                                        to="/my-applications" 
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
                                    >
                                        📝 Đã ứng tuyển
                                    </Link>
                                )}
                                
                                <Link 
                                    to="/profile" 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
                                >
                                    👤 Hồ sơ của tôi
                                </Link>
                                
                                <button 
                                    onClick={handleLogout}
                                    className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                >
                                    🚪 Đăng xuất
                                </button>
                            </>
                        ) : (
                            <>
                                <Link 
                                    to="/login" 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
                                >
                                    🔑 Đăng nhập
                                </Link>
                                <Link 
                                    to="/register" 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-3 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition"
                                >
                                    📝 Đăng ký
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </nav>
            
            {/* Thêm style cho animation */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                .animate-slideDown {
                    animation: slideDown 0.3s ease-out;
                }
            `}</style>
        </header>
    );
};

export default Header;