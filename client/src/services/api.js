import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('sahi_user') || 'null');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getProfile = () => api.get('/auth/me');
export const updateProfile = (data) => api.put('/auth/profile', data);
export const addFamilyMember = (data) => api.post('/auth/family', data);
export const getFamilyMembers = () => api.get('/auth/family');

// Reports
export const analyzeReport = (formData) => api.post('/reports/analyze', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const getDemoAnalysis = (language) => api.post('/reports/demo', { language });
export const getReports = () => api.get('/reports');
export const getReport = (id) => api.get(`/reports/${id}`);
export const deleteReport = (id) => api.delete(`/reports/${id}`);
export const getTrends = (valueName) => api.get(`/reports/trends/${valueName}`);

export default api;
