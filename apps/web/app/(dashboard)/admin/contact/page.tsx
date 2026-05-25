'use client'

import { useState, useEffect } from 'react'
import { MailOpen, Mail, Filter } from 'lucide-react'
import api from '@/lib/api'

interface Contact {
  id: string; name: string; email: string
  subject: string | null; message: string
  isRead: boolean; createdAt: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default function AdminContactPage() {
  const [items,    setItems]    = useState<Contact[]>([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState<'ALL' | 'UNREAD' | 'READ'>('ALL')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [marking,  setMarking]  = useState<string | null>(null)

  const load = () =>
    api.get<Contact[]>('/contact')
      .then(r => setItems(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  async function markRead(id: string) {
    setMarking(id)
    await api.patch(`/contact/${id}/read`).catch(() => {})
    await load()
    setMarking(null)
  }

  const filtered = items.filter(c => {
    if (filter === 'UNREAD') return !c.isRead
    if (filter === 'READ')   return c.isRead
    return true
  })

  const unreadCount = items.filter(c => !c.isRead).length

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-semibold" style={{ fontSize: 26, color: 'var(--ink)' }}>Contact Submissions</h1>
          <p style={{ color: 'var(--ink-48)', fontSize: 14, marginTop: 2 }}>
            {items.length} total · {unreadCount} unread
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        <Filter className="w-4 h-4 text-ink-48 self-center shrink-0" strokeWidth={1.8} />
        {([['ALL', 'All'], ['UNREAD', 'Unread'], ['READ', 'Read']] as const).map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className="rounded-pill px-4 py-2 font-semibold transition-all"
            style={{
              fontSize: 13,
              background: filter === val ? 'var(--primary)' : 'var(--canvas)',
              color:      filter === val ? '#fff'           : 'var(--ink-48)',
              border:     filter === val ? '1px solid var(--primary)' : '1px solid var(--hairline)',
            }}>
            {label}
            {val === 'UNREAD' && unreadCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center rounded-full text-white font-bold"
                style={{ width: 18, height: 18, fontSize: 10, background: filter === 'UNREAD' ? 'rgba(255,255,255,0.3)' : 'var(--primary)' }}>
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-7 h-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 rounded-2xl bg-canvas text-center"
          style={{ border: '1px solid var(--hairline)' }}>
          <MailOpen className="w-10 h-10 text-ink-48 mb-3" strokeWidth={1.4} />
          <p style={{ color: 'var(--ink-48)', fontSize: 16 }}>
            {filter === 'UNREAD' ? 'All caught up!' : 'No submissions yet.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(item => (
            <div key={item.id}
              className="rounded-2xl bg-canvas overflow-hidden"
              style={{
                border: item.isRead ? '1px solid var(--hairline)' : '1px solid rgba(0,102,204,0.25)',
                boxShadow: item.isRead ? '0 1px 6px rgba(0,0,0,0.05)' : '0 1px 12px rgba(0,102,204,0.1)',
              }}>

              {/* Header row */}
              <button
                className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-canvas-parchment transition-colors"
                onClick={() => setExpanded(e => e === item.id ? null : item.id)}
              >
                <div className="shrink-0">
                  {item.isRead
                    ? <MailOpen className="w-5 h-5 text-ink-48" strokeWidth={1.6} />
                    : <Mail     className="w-5 h-5 text-primary" strokeWidth={1.8} />
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-semibold" style={{ fontSize: 14, color: 'var(--ink)' }}>
                      {item.name}
                    </p>
                    {!item.isRead && (
                      <span className="inline-block w-2 h-2 rounded-full" style={{ background: 'var(--primary)' }} />
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--ink-48)' }}>
                    {item.email}
                    {item.subject ? ` · ${item.subject}` : ''}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p style={{ fontSize: 12, color: 'var(--ink-48)' }}>{formatDate(item.createdAt)}</p>
                </div>
              </button>

              {/* Expanded message */}
              {expanded === item.id && (
                <div style={{ borderTop: '1px solid var(--divider-soft)' }}>
                  <div className="px-6 py-4">
                    {item.subject && (
                      <p className="font-semibold mb-2" style={{ fontSize: 14, color: 'var(--ink)' }}>
                        Re: {item.subject}
                      </p>
                    )}
                    <p style={{ fontSize: 15, color: 'var(--ink-80)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                      {item.message}
                    </p>
                  </div>
                  {!item.isRead && (
                    <div className="px-6 pb-4 flex items-center gap-3">
                      <button
                        onClick={() => markRead(item.id)}
                        disabled={marking === item.id}
                        className="flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors"
                        style={{ fontSize: 13, background: 'rgba(0,102,204,0.08)', color: 'var(--primary)', border: '1px solid rgba(0,102,204,0.2)' }}
                      >
                        <MailOpen className="w-4 h-4" strokeWidth={1.7} />
                        {marking === item.id ? 'Marking…' : 'Mark as read'}
                      </button>
                      <a
                        href={`mailto:${item.email}?subject=Re: ${encodeURIComponent(item.subject ?? 'Your enquiry')}`}
                        className="flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors hover:bg-canvas-parchment"
                        style={{ fontSize: 13, color: 'var(--ink-48)', border: '1px solid var(--hairline)' }}
                      >
                        Reply via email
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
