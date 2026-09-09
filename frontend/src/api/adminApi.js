import axiosClient from './axiosClient';

export const adminApi = {
  // Dashboard & Statistics
  getDashboardStats: async () => {
    const response = await axiosClient.get('/admin/dashboard-stats');
    return response.data;
  },

  // Bookings
  getBookings: async (params = {}) => {
    const response = await axiosClient.get('/admin/bookings', { params });
    return response.data;
  },
  updateBookingStatus: async (bookingId, status) => {
    const response = await axiosClient.put(`/admin/bookings/${bookingId}/status`, { status });
    return response.data;
  },
  assignDriver: async (bookingId, driverId) => {
    const response = await axiosClient.put(`/admin/bookings/${bookingId}/assign-driver`, { driver_id: driverId });
    return response.data;
  },
  deleteBooking: async (bookingId) => {
    const response = await axiosClient.delete(`/admin/bookings/${bookingId}`);
    return response.data;
  },

  // Cars Management
  getAllCars: async () => {
    const response = await axiosClient.get('/admin/cars');
    return response.data;
  },
  createCar: async (carData) => {
    const response = await axiosClient.post('/admin/cars', carData);
    return response.data;
  },
  updateCar: async (carId, carData) => {
    const response = await axiosClient.put(`/admin/cars/${carId}`, carData);
    return response.data;
  },
  deleteCar: async (carId) => {
    const response = await axiosClient.delete(`/admin/cars/${carId}`);
    return response.data;
  },

  // Drivers Management
  getAllDrivers: async () => {
    const response = await axiosClient.get('/admin/drivers');
    return response.data;
  },
  createDriver: async (driverData) => {
    const response = await axiosClient.post('/admin/drivers', driverData);
    return response.data;
  },
  updateDriver: async (driverId, driverData) => {
    const response = await axiosClient.put(`/admin/drivers/${driverId}`, driverData);
    return response.data;
  },
  deleteDriver: async (driverId) => {
    const response = await axiosClient.delete(`/admin/drivers/${driverId}`);
    return response.data;
  },

  // System Logs Management
  getSystemLogs: async (params = {}) => {
    const response = await axiosClient.get('/admin/system-logs', { params });
    return response.data;
  },
  getLogStats: async () => {
    const response = await axiosClient.get('/admin/system-logs/stats');
    return response.data;
  },
  resolveLog: async (logId, resolveData) => {
    const response = await axiosClient.put(`/admin/system-logs/${logId}/resolve`, resolveData);
    return response.data;
  },
  archiveLogs: async () => {
    const response = await axiosClient.delete('/admin/system-logs/archive');
    return response.data;
  },

  // Settings & Inquiries
  getSettings: async () => {
    const response = await axiosClient.get('/admin/settings');
    return response.data;
  },
  updateSetting: async (key, data) => {
    const response = await axiosClient.put(`/admin/settings/${key}`, data);
    return response.data;
  },
  getMessages: async () => {
    const response = await axiosClient.get('/admin/messages');
    return response.data;
  },
  toggleMessageRead: async (msgId) => {
    const response = await axiosClient.put(`/admin/messages/${msgId}/read`);
    return response.data;
  }
};
