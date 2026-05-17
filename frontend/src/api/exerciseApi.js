import api from './axios'

export const exerciseApi = {
  getAll:  (params)     => api.get('/api/exercises', { params }),
  getById: (id)         => api.get(`/api/exercises/${id}`),
  create:  (data)       => api.post('/api/exercises', data),
  update:  (id, data)   => api.put(`/api/exercises/${id}`, data),
  remove:  (id)         => api.delete(`/api/exercises/${id}`),
}
