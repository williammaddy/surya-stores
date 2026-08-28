import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('surya_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      // If token expired while browsing protected pages, clear auth and redirect
      if (
        currentPath.startsWith('/admin') ||
        currentPath.startsWith('/orders') ||
        currentPath.startsWith('/profile') ||
        currentPath.startsWith('/checkout')
      ) {
        localStorage.removeItem('surya_auth_token');
        localStorage.removeItem('surya_auth_user');
        if (currentPath.startsWith('/admin') && currentPath !== '/admin/login') {
          window.location.href = '/admin/login';
        } else if (!currentPath.startsWith('/admin') && currentPath !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
