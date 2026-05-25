'use client'

import { useState } from 'react'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import AnimateIn from '@/components/ui/AnimateIn'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'

type Field = 'name' | 'email' | 'subject' | 'message'

const SERVICES = [
  'Book Editing & Proofreading',
  'Cover Design',
  'Global Distribution',
  'Marketing & PR',
  'Audiobook Production',
  'Full Publishing Package',
  'General Inquiry',
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [serverError, setServerError] = useState('')

  function validate() {
    const e: Partial<Record<Field, string>> = {}
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Name must be at least 2 characters'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))  e.email = 'Enter a valid email address'
    if (!form.message.trim() || form.message.trim().length < 10) e.message = 'Message must be at least 10 characters'
    return e
  }

  function set(field: Field, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setStatus('loading')
    try {
      const res = await fetch(`${API}/contact`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...form, subject: form.subject || undefined }),
      })
      if (!res.ok) throw new Error('Failed to submit')
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus('error')
      setServerError('Something went wrong. Please try again or email us directly.')
    }
  }

  return (
    <div style={{ background: 'var(--canvas-parchment)', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ paddingTop: 96, paddingBottom: 64 }}>
        <div className="container-narrow text-center">
          <AnimateIn>
            <p className="font-semibold uppercase mb-4"
              style={{ color: 'var(--primary)', fontSize: 12, letterSpacing: '0.1em' }}>
              Get In Touch
            </p>
            <h1
              className="font-semibold mb-5"
              style={{
                fontFamily: "'SF Pro Display', system-ui, sans-serif",
                fontSize: 'clamp(36px, 6vw, 56px)',
                lineHeight: 1.07,
                letterSpacing: '-0.5px',
                color: 'var(--ink)',
              }}
            >
              We'd love to hear<br />from you.
            </h1>
            <p style={{ color: 'var(--ink-48)', fontSize: 19, lineHeight: 1.45, maxWidth: 480, margin: '0 auto' }}>
              Tell us about your book and what you're looking for. Our team responds within one business day.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Form card */}
      <section style={{ paddingBottom: 120 }}>
        <div className="container-narrow">
          <AnimateIn delay={100}>

            {status === 'success' ? (
              <div
                className="flex flex-col items-center text-center py-20 px-8 rounded-2xl bg-white"
                style={{ border: '1px solid var(--hairline)', boxShadow: 'var(--shadow-product)' }}
              >
                <CheckCircle className="w-16 h-16 mb-6" style={{ color: 'var(--primary)' }} strokeWidth={1.4} />
                <h2 className="font-semibold mb-3" style={{ fontSize: 28, color: 'var(--ink)' }}>Message received!</h2>
                <p style={{ color: 'var(--ink-48)', fontSize: 17, maxWidth: 360 }}>
                  Thanks for reaching out. A member of our team will get back to you within one business day.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="btn-primary mt-8"
                  style={{ fontSize: 15 }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={submit}
                noValidate
                className="rounded-2xl bg-white p-10"
                style={{ border: '1px solid var(--hairline)', boxShadow: 'var(--shadow-product)' }}
              >

                {/* Server error */}
                {status === 'error' && (
                  <div
                    className="flex items-start gap-3 rounded-xl p-4 mb-8"
                    style={{ background: 'rgba(255,59,48,0.07)', border: '1px solid rgba(255,59,48,0.2)' }}
                  >
                    <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-500" strokeWidth={1.6} />
                    <p style={{ color: '#c0392b', fontSize: 15 }}>{serverError}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  {/* Name */}
                  <div>
                    <label className="block mb-2 font-semibold" style={{ fontSize: 14, color: 'var(--ink-80)' }}>
                      Full name <span style={{ color: 'var(--primary)' }}>*</span>
                    </label>
                    <input
                      className="input-field"
                      placeholder="Jane Smith"
                      value={form.name}
                      onChange={e => set('name', e.target.value)}
                      disabled={status === 'loading'}
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && <p style={{ color: '#c0392b', fontSize: 13, marginTop: 4 }}>{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block mb-2 font-semibold" style={{ fontSize: 14, color: 'var(--ink-80)' }}>
                      Email address <span style={{ color: 'var(--primary)' }}>*</span>
                    </label>
                    <input
                      type="email"
                      className="input-field"
                      placeholder="jane@example.com"
                      value={form.email}
                      onChange={e => set('email', e.target.value)}
                      disabled={status === 'loading'}
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && <p style={{ color: '#c0392b', fontSize: 13, marginTop: 4 }}>{errors.email}</p>}
                  </div>
                </div>

                {/* Service / subject */}
                <div className="mb-6">
                  <label className="block mb-2 font-semibold" style={{ fontSize: 14, color: 'var(--ink-80)' }}>
                    I'm interested in
                  </label>
                  <select
                    className="input-field"
                    value={form.subject}
                    onChange={e => set('subject', e.target.value)}
                    disabled={status === 'loading'}
                    style={{ appearance: 'none', cursor: 'pointer' }}
                  >
                    <option value="">Select a service (optional)</option>
                    {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Message */}
                <div className="mb-8">
                  <label className="block mb-2 font-semibold" style={{ fontSize: 14, color: 'var(--ink-80)' }}>
                    Your message <span style={{ color: 'var(--primary)' }}>*</span>
                  </label>
                  <textarea
                    rows={6}
                    className="input-field"
                    placeholder="Tell us about your book, your goals, and how we can help…"
                    value={form.message}
                    onChange={e => set('message', e.target.value)}
                    disabled={status === 'loading'}
                    aria-invalid={!!errors.message}
                    style={{ resize: 'vertical', minHeight: 140 }}
                  />
                  {errors.message && <p style={{ color: '#c0392b', fontSize: 13, marginTop: 4 }}>{errors.message}</p>}
                </div>

                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <p style={{ color: 'var(--ink-48)', fontSize: 13 }}>
                    We respond within 1 business day. All information is kept private.
                  </p>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-primary"
                    style={{ fontSize: 17, padding: '12px 28px', minWidth: 160 }}
                  >
                    {status === 'loading'
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                      : 'Send message'}
                  </button>
                </div>

              </form>
            )}
          </AnimateIn>
        </div>
      </section>

      {/* Info strip */}
      <section style={{ background: 'var(--surface-tile-1)', paddingTop: 64, paddingBottom: 64 }}>
        <div className="container-apple">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center sm:text-left">
            {[
              { label: 'Email', value: 'hello@smartbookpublishing.com' },
              { label: 'Response time', value: 'Within 1 business day' },
              { label: 'Hours', value: 'Mon – Fri, 9am – 6pm ET' },
            ].map(item => (
              <div key={item.label}>
                <p className="font-semibold uppercase mb-2" style={{ color: 'var(--ink-48)', fontSize: 11, letterSpacing: '0.08em' }}>
                  {item.label}
                </p>
                <p className="font-semibold" style={{ color: '#fff', fontSize: 17 }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
