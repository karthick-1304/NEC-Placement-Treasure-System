import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  timeout: 30000,
});

// Attach JWT from localStorage on every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nec_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong. Please try again.';
    const status  = error.response?.status;

    if (status === 401) {
      localStorage.removeItem('nec_token');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject({ message, status });
  }
);

export default axiosInstance;