import axiosClient from './axiosClient';

export const bookingApi = {
  // Calculate server-side fare & distance
  calculateFare: async (data) => {
    const response = await axiosClient.post('/bookings/calculate-fare', data);
    return response.data;
  },

  // Create booking
  createBooking: async (bookingData) => {
    const response = await axiosClient.post('/bookings', bookingData);
    return response.data;
  },

  // Get booking details by booking code or ID
  getBooking: async (bookingIdentifier) => {
    const response = await axiosClient.get(`/bookings/${bookingIdentifier}`);
    return response.data;
  },

  // Submit contact message
  submitContact: async (contactData) => {
    const response = await axiosClient.post('/contact', contactData);
    return response.data;
  }
};
