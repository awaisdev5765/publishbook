'use client'

import { useEffect, useState } from 'react'
import { Loader2, Save } from 'lucide-react'
import api from '@/lib/api'

interface AboutContent {
  key: string
  title: string | null
  content: string
  updatedAt: string | null
}

export default function AdminAboutPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api.get<AboutContent>('/about')
      .then(({ data }) => {
        setTitle(data.title ?? '')
        setContent(data.content ?? '')
      })
      .catch(() => setError('Failed to load About content.'))
      .finally(() => setLoading(false))
  }, [])

  async function save() {
    if (content.trim().length < 20) {
      setError('About content should be at least 20 characters.')
      return
    }

    setSaving(true)
    setError('')
    setMessage('')
    try {
      await api.put('/about', {
        title: title.trim() || undefined,
        content: content.trim(),
      })
      setMessage('About section updated successfully.')
    } catch {
      setError('Could not save About content. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-7 h-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="font-semibold" style={{ fontSize: 26, color: 'var(--ink)' }}>
          About Section
        </h1>
        <p style={{ color: 'var(--ink-48)', fontSize: 14, marginTop: 2 }}>
          Edit the public About page content shown on your website.
        </p>
      </div>

      <div
        className="rounded-2xl bg-canvas p-6 flex flex-col gap-4"
        style={{ border: '1px solid var(--hairline)', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}
      >
        <div>
          <label className="block mb-1.5 font-medium" style={{ fontSize: 13, color: 'var(--ink-80)' }}>
            Heading
          </label>
          <input
            className="input-field"
            placeholder="About Smart Book Publishing"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1.5 font-medium" style={{ fontSize: 13, color: 'var(--ink-80)' }}>
            Content
          </label>
          <textarea
            rows={16}
            className="input-field"
            placeholder="Write your About page story here..."
            value={content}
            style={{ resize: 'vertical', minHeight: 280, lineHeight: 1.6 }}
            onChange={e => setContent(e.target.value)}
          />
          <p style={{ fontSize: 12, color: 'var(--ink-48)', marginTop: 8 }}>
            Tip: Use blank lines to split paragraphs.
          </p>
        </div>

        {error && <p style={{ color: '#ff3b30', fontSize: 13 }}>{error}</p>}
        {message && <p style={{ color: '#34c759', fontSize: 13 }}>{message}</p>}

        <div className="flex justify-end">
          <button onClick={save} disabled={saving} className="btn-primary" style={{ fontSize: 14, padding: '10px 18px' }}>
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save About</>}
          </button>
        </div>
      </div>
    </div>
  )
}
