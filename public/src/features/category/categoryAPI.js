import api from '@/shared/api/axios';

const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
};

export default categoryAPI;
