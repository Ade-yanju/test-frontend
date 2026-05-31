import { useState, useCallback } from 'react'
import { apiClient } from '../api/client'

export interface AuthUser {
  id: string
  email: string
  name: string | null
}

interface AuthState {
  token: string | null
  user: AuthUser | null
}

interface AuthResponse {
  token: string
  user: AuthUser
}

const TOKEN_KEY = 'drop_token'
const USER_KEY  = 'drop_user'

function loadFromStorage(): AuthState {
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    const raw   = localStorage.getItem(USER_KEY)
    if (token && raw) return { token, user: JSON.parse(raw) as AuthUser }
  } catch {
    // corrupted storage — clear it
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }
  return { token: null, user: null }
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>(loadFromStorage)

  const persist = useCallback((data: AuthResponse) => {
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    setAuth({ token: data.token, user: data.user })
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiClient.post<AuthResponse>('/auth/login', { email, password })
    persist(data)
    return data.user
  }, [persist])

  const register = useCallback(async (email: string, password: string, name: string) => {
    const data = await apiClient.post<AuthResponse>('/auth/register', { email, password, name })
    persist(data)
    return data.user
  }, [persist])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setAuth({ token: null, user: null })
  }, [])

  return {
    token: auth.token,
    user:  auth.user,
    isAuthenticated: !!auth.token,
    login,
    register,
    logout,
  }
}
