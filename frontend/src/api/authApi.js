import api from './axios'

export const authApi = {
  login:         (credentials) => api.post('/api/auth/login',    credentials),
  register:      (data)        => api.post('/api/auth/register', data),
  getProfile:    ()            => api.get('/api/profile'),
  updateProfile: (data)        => api.put('/api/profile',        data),
  deleteAccount: ()            => api.delete('/api/profile'),
}
