import axios, { type AxiosInstance } from 'axios'

// ── In-memory access token store (never persisted to localStorage) ─────────
let _accessToken: string | null = null

export const getAccessToken   = ()          => _accessToken
export const setAccessToken   = (t: string) => { _accessToken = t }
export const clearAccessToken = ()          => { _accessToken = null }

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'

// ── Plain axios for calls that must NOT go through the interceptor ──────────
// Used by AuthContext for the initial session restore, so a 401 there
// never triggers the auto-refresh loop.
export const rawAxios = axios.create({ baseURL: BASE, withCredentials: true })

// ── Authenticated Axios instance ───────────────────────────────────────────
const api: AxiosInstance = axios.create({
  baseURL:         BASE,
  withCredentials: true,
  headers:         { 'Content-Type': 'application/json' },
})

// Attach access token to every outgoing request
api.interceptors.request.use(config => {
  if (_accessToken) config.headers.Authorization = `Bearer ${_accessToken}`
  return config
})

// Auto-refresh on 401 — one retry per request
// IMPORTANT: skip this interceptor if the failing request WAS the refresh
// call itself, or if the browser is already on an auth page, to prevent loops.
const AUTH_PATHS = ['/login', '/register']

api.interceptors.response.use(
  response => response,
  async (error: unknown) => {
    const err = error as import('axios').AxiosError & { config: { _retry?: boolean; url?: string } }

    const isRefreshEndpoint = err.config?.url?.includes('/auth/refresh')
    const onAuthPage = typeof window !== 'undefined' &&
      AUTH_PATHS.some(p => window.location.pathname.startsWith(p))

    if (err.response?.status === 401 && !err.config._retry && !isRefreshEndpoint) {
      err.config._retry = true
      try {
        // Use rawAxios so this inner call does NOT go through the interceptor
        const { data } = await rawAxios.post<{ accessToken: string }>('/auth/refresh')
        setAccessToken(data.accessToken)
        err.config.headers.set('Authorization', `Bearer ${data.accessToken}`)
        return api(err.config)
      } catch {
        clearAccessToken()
        if (typeof window !== 'undefined' && !onAuthPage) {
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  },
)

export default api
