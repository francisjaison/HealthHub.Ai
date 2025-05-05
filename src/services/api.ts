import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Doctor Dashboard APIs
export const doctorApi = {
  getAppointments: async () => {
    const response = await api.get('/doctor/appointments');
    return response.data;
  },

  getPatientHistory: async (patientId: string) => {
    const response = await api.get(`/doctor/patients/${patientId}/history`);
    return response.data;
  },

  sendAdvice: async (patientId: string, advice: string) => {
    const response = await api.post(`/doctor/patients/${patientId}/advice`, { advice });
    return response.data;
  },

  updateAppointmentStatus: async (appointmentId: string, status: 'scheduled' | 'completed' | 'cancelled') => {
    const response = await api.patch(`/doctor/appointments/${appointmentId}`, { status });
    return response.data;
  },

  getAvailableSlots: async (date: string) => {
    const response = await api.get(`/doctor/availability/${date}`);
    return response.data;
  },
};

// Admin Dashboard APIs
export const adminApi = {
  getSystemStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getUsers: async (role?: 'patient' | 'doctor' | 'admin') => {
    const response = await api.get('/admin/users', { params: { role } });
    return response.data;
  },

  updateUserStatus: async (userId: string, status: 'active' | 'suspended' | 'pending') => {
    const response = await api.patch(`/admin/users/${userId}/status`, { status });
    return response.data;
  },

  approveDoctor: async (userId: string) => {
    const response = await api.post(`/admin/doctors/${userId}/approve`);
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },
};

export default api; 