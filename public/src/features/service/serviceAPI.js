import api from '@/shared/api/axios';

const serviceAPI = {
  getAll: () => api.get('/services'),
  getById: (id) => api.get(`/services/${id}`),
};

export default serviceAPI;
