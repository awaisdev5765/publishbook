'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import type { AxiosError } from 'axios'

interface ApiError {
  error: { message: string[] }
}

export default function RegisterPage() {
  const { register } = useAuth()

  const [name,         setName]         = useState('')
  const [email,        setEmail]        = useState('')
  const [password,     setPassword]     = useState('')
  const [confirm,      setConfirm]      = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error,        setError]        = useState<string | null>(null)
  const [isLoading,    setIsLoading]    = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setError(null)
    setIsLoading(true)
    try {
      await register(name, email, password)
      window.location.href = '/dashboard'
    } catch (err) {
      const axiosErr = err as AxiosError<ApiError>
      const msg = axiosErr.response?.data?.error?.message?.[0] ?? 'Registration failed. Please try again.'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="w-full max-w-[400px] bg-canvas rounded-2xl p-8 sm:p-10"
      style={{ border: '1px solid var(--hairline)', boxShadow: '0 4px 32px rgba(0,0,0,0.08)' }}
    >
      {/* Heading */}
      <div className="mb-8">
        <h1
          className="text-ink font-semibold mb-1.5"
          style={{
            fontFamily: "'SF Pro Display', system-ui, sans-serif",
            fontSize: 28,
            letterSpacing: '-0.374px',
          }}
        >
          Create your account
        </h1>
        <p className="text-ink-48" style={{ fontSize: 15, letterSpacing: '-0.16px' }}>
          Start publishing today — it&apos;s free to join
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-ink font-medium" style={{ fontSize: 14, letterSpacing: '-0.16px' }}>
            Full name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            placeholder="Sarah Chen"
            className="input-field"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

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
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-ink font-medium" style={{ fontSize: 14, letterSpacing: '-0.16px' }}>
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="Min. 8 characters"
              className="input-field pr-12"
              value={password}
              onChange={e => setPassword(e.target.value)}
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
          <p className="text-ink-48" style={{ fontSize: 12, letterSpacing: '-0.1px' }}>
            Must include at least one letter and one number
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirm" className="text-ink font-medium" style={{ fontSize: 14, letterSpacing: '-0.16px' }}>
            Confirm password
          </label>
          <input
            id="confirm"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            placeholder="Repeat your password"
            className="input-field"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
          />
        </div>

        {/* Error */}
        {error && (
          <p
            className="text-center rounded-lg py-2.5 px-4"
            style={{
              color: '#ff3b30',
              fontSize: 14,
              letterSpacing: '-0.12px',
              background: 'rgba(255, 59, 48, 0.06)',
              border: '1px solid rgba(255, 59, 48, 0.15)',
            }}
          >
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary justify-center w-full"
          style={{ fontSize: 17, padding: '13px 24px', marginTop: 2 }}
        >
          {isLoading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</>
            : 'Create account'
          }
        </button>
      </form>

      {/* Footer link */}
      <p
        className="text-center mt-6 text-ink-48"
        style={{ fontSize: 14, letterSpacing: '-0.12px' }}
      >
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  )
}
