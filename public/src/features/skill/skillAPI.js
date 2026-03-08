import api from '@/shared/api/axios';

const skillAPI = {
  getAll: () => api.get('/skills'),
  getById: (id) => api.get(`/skills/${id}`),
};

export default skillAPI;
