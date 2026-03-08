import api from '@/shared/api/axios';

const bookAPI = {
  getAll: () => api.get('/books'),
  getById: (id) => api.get(`/books/${id}`),
};

export default bookAPI;
