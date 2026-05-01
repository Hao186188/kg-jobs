// services/api.js
import axios from 'axios';
import { toast } from 'react-hot-toast';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor: Thêm token tự động
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor: Xử lý lỗi toàn cục
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            toast.error('Phiên đăng nhập đã hết hạn');
        } else if (error.response?.status === 403) {
            toast.error('Bạn không có quyền thực hiện hành động này');
        } else if (error.response?.status === 500) {
            toast.error('Lỗi server, vui lòng thử lại sau');
        }
        return Promise.reject(error);
    }
);

export default api;