import axios from 'axios';

// Base URL: Use import.meta.env.VITE_API_URL or fallback to http://localhost:5000 (or current origin in browser)
const rawUrl =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'http://localhost:5000');

// Normalize to ensure it points to /api/v1
const cleanBaseUrl = rawUrl.replace(/\/+$/, '');
const baseURL = cleanBaseUrl.endsWith('/api/v1')
  ? cleanBaseUrl
  : cleanBaseUrl.endsWith('/api')
  ? `${cleanBaseUrl}/v1`
  : `${cleanBaseUrl}/api/v1`;

const api = axios.create({
  baseURL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('library_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (err) => {
    const message = err.response?.data?.message || err.message || 'Request failed';
    return Promise.reject(new Error(message));
  }
);

export default api;
