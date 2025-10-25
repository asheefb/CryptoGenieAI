import { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await axios.get('/api/auth/me', { withCredentials: true })
      setUser(response.data)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const response = await axios.post('/api/auth/login', { email, password }, { withCredentials: true })
    setUser(response.data)
    return response.data
  }

  const register = async (email, password) => {
    const response = await axios.post('/api/auth/register', { email, password }, { withCredentials: true })
    setUser(response.data)
    return response.data
  }

  const logout = async () => {
    await axios.post('/api/auth/logout', {}, { withCredentials: true })
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser: checkAuth
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
