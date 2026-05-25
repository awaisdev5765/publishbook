'use client'

import { Suspense, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import type { AxiosError } from 'axios'

interface ApiError { error: { message: string[] } }

// Split out the part that reads searchParams so Suspense wraps it correctly
function LoginForm() {
  const { login }    = useAuth()
  const searchParams = useSearchParams()

  const [email,        setEmail]        = useState('')
  const [password,     setPassword]     = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error,        setError]        = useState<string | null>(null)
  const [isLoading,    setIsLoading]    = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      await login(email, password)
      const from = searchParams.get('from') ?? '/dashboard'
      // Full navigation so the browser sends the new cookie to middleware
      window.location.href = from.startsWith('/') ? from : '/dashboard'
    } catch (err) {
      const axiosErr = err as AxiosError<ApiError>
      const msg = axiosErr.response?.data?.error?.message?.[0] ?? 'Invalid email or password.'
      setError(msg)
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-ink font-medium" style={{ fontSize: 14, letterSpacing: '-0.16px' }}>
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className="input-field"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-ink font-medium" style={{ fontSize: 14, letterSpacing: '-0.16px' }}>
            Password
          </label>
          <Link href="/forgot-password" className="text-primary hover:underline" style={{ fontSize: 13 }}>
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className="input-field pr-12"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-48 hover:text-ink transition-colors"
            onClick={() => setShowPassword(s => !s)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword
              ? <EyeOff className="w-[17px] h-[17px]" strokeWidth={1.6} />
              : <Eye    className="w-[17px] h-[17px]" strokeWidth={1.6} />
            }
          </button>
        </div>
      </div>

      {error && (
        <p
          className="text-center rounded-lg py-2.5 px-4"
          style={{ color: '#ff3b30', fontSize: 14, background: 'rgba(255,59,48,0.06)', border: '1px solid rgba(255,59,48,0.15)' }}
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary justify-center w-full"
        style={{ fontSize: 17, padding: '13px 24px', marginTop: 2 }}
      >
        {isLoading
          ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
          : 'Sign in'
        }
      </button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div
      className="w-full max-w-[400px] bg-canvas rounded-2xl p-8 sm:p-10"
      style={{ border: '1px solid var(--hairline)', boxShadow: '0 4px 32px rgba(0,0,0,0.08)' }}
    >
      <div className="mb-8">
        <h1
          className="text-ink font-semibold mb-1.5"
          style={{ fontFamily: "'SF Pro Display', system-ui, sans-serif", fontSize: 28, letterSpacing: '-0.374px' }}
        >
          Welcome back
        </h1>
        <p className="text-ink-48" style={{ fontSize: 15, letterSpacing: '-0.16px' }}>
          Sign in to your account
        </p>
      </div>

      {/* Suspense required by Next.js 14 for useSearchParams() */}
      <Suspense fallback={<div className="h-64 flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-ink-48" /></div>}>
        <LoginForm />
      </Suspense>

      <p className="text-center mt-6 text-ink-48" style={{ fontSize: 14 }}>
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-primary hover:underline font-medium">Create one</Link>
      </p>
    </div>
  )
}
