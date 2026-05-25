'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import api, { rawAxios, setAccessToken, clearAccessToken } from '@/lib/api'

export interface AuthUser {
  id:        string
  name:      string
  email:     string
  role:      'ADMIN' | 'AUTHOR' | 'CLIENT'
  avatarUrl: string | null
}

interface AuthContextValue {
  user:            AuthUser | null
  isLoading:       boolean
  isAuthenticated: boolean
  login:     (email: string, password: string) => Promise<void>
  register:  (name: string, email: string, password: string) => Promise<void>
  logout:    () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,      setUser]      = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore session on mount using rawAxios so the 401-interceptor loop
  // is never triggered when there is simply no active session.
  useEffect(() => {
    rawAxios
      .post<{ accessToken: string; user: AuthUser }>('/auth/refresh')
      .then(({ data }) => {
        setAccessToken(data.accessToken)
        setUser(data.user)
      })
      .catch(() => {
        // No valid session — clear any stale cookie so the middleware
        // won't keep bouncing the user back to /dashboard.
        rawAxios.post('/auth/logout').catch(() => {})
      })
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post<{ accessToken: string; user: AuthUser }>(
      '/auth/login',
      { email, password },
    )
    setAccessToken(data.accessToken)
    setUser(data.user)
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { data } = await api.post<{ accessToken: string; user: AuthUser }>(
      '/auth/register',
      { name, email, password },
    )
    setAccessToken(data.accessToken)
    setUser(data.user)
  }, [])

  const logout = useCallback(async () => {
    await api.post('/auth/logout').catch(() => {})
    clearAccessToken()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
