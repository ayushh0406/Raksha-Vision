import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
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

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    const response = await api.post('/auth/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Sensors API
export const sensorsAPI = {
  getAllSensors: async () => {
    const response = await api.get('/sensors');
    return response.data;
  },
  getSensorById: async (id: string) => {
    const response = await api.get(`/sensors/${id}`);
    return response.data;
  },
  createSensor: async (sensorData: any) => {
    const response = await api.post('/sensors', sensorData);
    return response.data;
  },
  updateSensor: async (id: string, sensorData: any) => {
    const response = await api.put(`/sensors/${id}`, sensorData);
    return response.data;
  },
  deleteSensor: async (id: string) => {
    const response = await api.delete(`/sensors/${id}`);
    return response.data;
  },
  getSensorData: async (id: string, limit: number = 10) => {
    const response = await api.get(`/sensors/${id}/data?limit=${limit}`);
    return response.data;
  },
  simulateSensorData: async () => {
    const response = await api.post('/sensors/simulate');
    return response.data;
  },
};

// Cameras API
export const camerasAPI = {
  getAllCameras: async () => {
    const response = await api.get('/cameras');
    return response.data;
  },
  getCameraById: async (id: string) => {
    const response = await api.get(`/cameras/${id}`);
    return response.data;
  },
  createCamera: async (cameraData: any) => {
    const response = await api.post('/cameras', cameraData);
    return response.data;
  },
  updateCamera: async (id: string, cameraData: any) => {
    const response = await api.put(`/cameras/${id}`, cameraData);
    return response.data;
  },
  deleteCamera: async (id: string) => {
    const response = await api.delete(`/cameras/${id}`);
    return response.data;
  },
  getCameraFrames: async (id: string, limit: number = 10) => {
    const response = await api.get(`/cameras/${id}/frames?limit=${limit}`);
    return response.data;
  },
  getLatestFrame: async (id: string) => {
    const response = await api.get(`/cameras/${id}/latest-frame`);
    return response.data;
  },
  simulateCameraFrames: async () => {
    const response = await api.post('/cameras/simulate');
    return response.data;
  },
};

// Alerts API
export const alertsAPI = {
  getAllAlerts: async (params: any = {}) => {
    const response = await api.get('/alerts', { params });
    return response.data;
  },
  getAlertById: async (id: string) => {
    const response = await api.get(`/alerts/${id}`);
    return response.data;
  },
  createAlert: async (alertData: any) => {
    const response = await api.post('/alerts', alertData);
    return response.data;
  },
  updateAlert: async (id: string, alertData: any) => {
    const response = await api.put(`/alerts/${id}`, alertData);
    return response.data;
  },
  deleteAlert: async (id: string) => {
    const response = await api.delete(`/alerts/${id}`);
    return response.data;
  },
  getAlertStats: async () => {
    const response = await api.get('/alerts/stats/summary');
    return response.data;
  },
  simulateAlerts: async (count: number = 1) => {
    const response = await api.post('/alerts/simulate', { count });
    return response.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getSummary: async () => {
    const response = await api.get('/dashboard/summary');
    return response.data;
  },
  getAlertsByType: async () => {
    const response = await api.get('/dashboard/alerts-by-type');
    return response.data;
  },
  getAlertsBySeverity: async () => {
    const response = await api.get('/dashboard/alerts-by-severity');
    return response.data;
  },
  getSensorsByType: async () => {
    const response = await api.get('/dashboard/sensors-by-type');
    return response.data;
  },
  getSystemHealth: async () => {
    const response = await api.get('/dashboard/system-health');
    return response.data;
  },
  getRecentActivity: async (limit: number = 10) => {
    const response = await api.get(`/dashboard/recent-activity?limit=${limit}`);
    return response.data;
  },
  getAlertTrends: async (days: number = 7) => {
    const response = await api.get(`/dashboard/alert-trends?days=${days}`);
    return response.data;
  },
};

export default api; 