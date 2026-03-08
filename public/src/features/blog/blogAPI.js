import api from '@/shared/api/axios';

const blogAPI = {
  getAll: () => api.get('/blogs'),
  getById: (id) => api.get(`/blogs/${id}`),
};

export default blogAPI;
