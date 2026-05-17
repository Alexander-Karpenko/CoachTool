import api from './axios'

export const athleteMaxApi = {
  getAll:  (athleteId)       => api.get(`/api/athletes/${athleteId}/maxes`),
  record:  (athleteId, data) => api.post(`/api/athletes/${athleteId}/maxes`, data),
  remove:  (athleteId, id)   => api.delete(`/api/athletes/${athleteId}/maxes/${id}`),
}
