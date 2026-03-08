import api from '@/shared/api/axios';

const projectAPI = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
};

export default projectAPI;
