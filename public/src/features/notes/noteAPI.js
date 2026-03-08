import api from '@/shared/api/axios';

const noteAPI = {
  getAll: () => api.get('/notes'),
  getById: (id) => api.get(`/notes/${id}`),
};

export default noteAPI;
