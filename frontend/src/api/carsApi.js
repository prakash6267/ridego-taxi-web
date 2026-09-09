import axiosClient from './axiosClient';

export const carsApi = {
  // Public car list
  getCars: async () => {
    const response = await axiosClient.get('/cars');
    return response.data;
  },

  // Public car details
  getCarById: async (carId) => {
    const response = await axiosClient.get(`/cars/${carId}`);
    return response.data;
  },

  // Nominatim location search autocomplete
  searchLocations: async (query) => {
    if (!query || query.length < 2) return [];
    const response = await axiosClient.get('/locations/search', {
      params: { q: query }
    });
    return response.data;
  }
};
