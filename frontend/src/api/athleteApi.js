import api from './axios'

export const athleteApi = {
  getAll:  ()           => api.get('/api/athletes'),
  getById: (id)         => api.get(`/api/athletes/${id}`),
  create:  (data)       => api.post('/api/athletes', data),
  update:  (id, data)   => api.put(`/api/athletes/${id}`, data),
  remove:  (id)         => api.delete(`/api/athletes/${id}`),
}
