import api from '@/shared/api/axios';

const experienceAPI = {
  getAll: () => api.get('/experiences'),
  getById: (id) => api.get(`/experiences/${id}`),
};

export default experienceAPI;
