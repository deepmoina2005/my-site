import api from '@/shared/api/axios';

const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
};

export default productAPI;
