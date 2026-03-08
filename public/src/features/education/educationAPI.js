import api from '@/shared/api/axios';

const educationAPI = {
  getAll: () => api.get('/educations'),
  getById: (id) => api.get(`/educations/${id}`),
};

export default educationAPI;
