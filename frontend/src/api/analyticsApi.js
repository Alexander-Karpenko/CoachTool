import api from './axios'

export const analyticsApi = {
  periodReport: (athleteId, from, to) =>
    api.get(`/api/analytics/athletes/${athleteId}/period-report`, { params: { from, to } }),

  progress: (athleteId, from, to, exerciseId) =>
    api.get(`/api/analytics/athletes/${athleteId}/progress`, {
      params: { from, to, ...(exerciseId ? { exerciseId } : {}) },
    }),
}
