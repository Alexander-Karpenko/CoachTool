import { createContext, useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api'
import { storage } from '../utils/storage'
import { ROUTES } from '../utils/constants'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [user, setUser]       = useState(() => storage.getUser())
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const login = useCallback(async (credentials) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await authApi.login(credentials)
      // Backend returns flat: { token, email, firstName, lastName, role }
      const { token, ...userInfo } = data
      storage.setToken(token)
      storage.setUser(userInfo)
      setUser(userInfo)
      navigate(ROUTES.DASHBOARD)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [navigate])

  const register = useCallback(async (registerData) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await authApi.register(registerData)
      const { token, ...userInfo } = data
      storage.setToken(token)
      storage.setUser(userInfo)
      setUser(userInfo)
      navigate(ROUTES.DASHBOARD)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Registration failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [navigate])

  const logout = useCallback(() => {
    storage.clear()
    setUser(null)
    navigate(ROUTES.LOGIN)
  }, [navigate])

  const updateUser = useCallback((updatedInfo) => {
    storage.setUser(updatedInfo)
    setUser(updatedInfo)
  }, [])

  const deleteAccount = useCallback(async () => {
    await authApi.deleteAccount()
    storage.clear()
    setUser(null)
    navigate(ROUTES.LOGIN)
  }, [navigate])

  const clearError = useCallback(() => setError(null), [])

  const value = useMemo(() => ({
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
    deleteAccount,
    clearError,
  }), [user, loading, error, login, register, logout, updateUser, deleteAccount, clearError])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
