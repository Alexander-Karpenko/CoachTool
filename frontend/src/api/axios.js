import axios from 'axios'
import { storage } from '../utils/storage'

const api = axios.create({
  // Empty baseURL: Vite proxy forwards /api/* to Spring Boot
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = storage.getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// On 401 — clear credentials and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
