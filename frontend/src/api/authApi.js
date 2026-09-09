import axiosClient from './axiosClient';

export const authApi = {
  login: async (credentials) => {
    const response = await axiosClient.post('/auth/login', credentials);
    return response.data;
  },
  getMe: async () => {
    const response = await axiosClient.get('/auth/me');
    return response.data;
  }
};
