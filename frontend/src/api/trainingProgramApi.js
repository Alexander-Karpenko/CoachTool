import api from './axios'

export const trainingProgramApi = {
  getAll:       ()              => api.get('/api/training-programs'),
  getByAthlete: (athleteId)     => api.get(`/api/training-programs/athlete/${athleteId}`),
  getById:      (id)            => api.get(`/api/training-programs/${id}`),
  create:       (data)          => api.post('/api/training-programs', data),
  update:       (id, data)      => api.put(`/api/training-programs/${id}`, data),
  remove:       (id)            => api.delete(`/api/training-programs/${id}`),
}
