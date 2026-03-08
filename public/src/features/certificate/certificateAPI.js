import api from '@/shared/api/axios';

const certificateAPI = {
  getAll: () => api.get('/certificates'),
  getById: (id) => api.get(`/certificates/${id}`),
};

export default certificateAPI;
