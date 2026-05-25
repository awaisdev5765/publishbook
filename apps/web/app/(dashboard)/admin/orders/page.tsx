'use client'

import { useState, useEffect } from 'react'
import { Search, TrendingUp } from 'lucide-react'
import api from '@/lib/api'

interface Order {
  id: string; serviceType: string; amount: number; status: string
  notes: string | null; createdAt: string
  user: { name: string; email: string }
  book: { title: string } | null
}

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  PENDING:   { bg: 'rgba(255,149,0,0.12)',  text: '#ff9f0a' },
  PAID:      { bg: 'rgba(52,199,89,0.12)',  text: '#34c759' },
  CANCELLED: { bg: 'rgba(255,59,48,0.12)',  text: '#ff3b30' },
}

const SERVICE_LABELS: Record<string, string> = {
  EDITING:      'Editing',
  COVER_DESIGN: 'Cover Design',
  DISTRIBUTION: 'Distribution',
  MARKETING:    'Marketing',
  AUDIOBOOK:    'Audiobook',
  FULL_PACKAGE: 'Full Package',
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.PENDING
  return (
    <span className="inline-block px-2.5 py-0.5 rounded-full font-semibold capitalize"
      style={{ fontSize: 11, background: s.bg, color: s.text }}>
      {status.toLowerCase()}
    </span>
  )
}

function formatCents(c: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(c / 100)
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function AdminOrdersPage() {
  const [orders,  setOrders]  = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [query,   setQuery]   = useState('')
  const [filter,  setFilter]  = useState('ALL')

  useEffect(() => {
    api.get<Order[]>('/orders')
      .then(r => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = orders.filter(o => {
    const matchQ = !query || o.user.name.toLowerCase().includes(query.toLowerCase()) ||
      o.user.email.toLowerCase().includes(query.toLowerCase())
    const matchF = filter === 'ALL' || o.status === filter
    return matchQ && matchF
  })

  const revenue = orders.filter(o => o.status === 'PAID').reduce((s, o) => s + o.amount, 0)

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="font-semibold" style={{ fontSize: 26, color: 'var(--ink)' }}>All Orders</h1>
        <p style={{ color: 'var(--ink-48)', fontSize: 14, marginTop: 2 }}>
          {orders.length} total orders · {formatCents(revenue)} collected
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total',     value: orders.length,                                  color: 'var(--ink)'   },
          { label: 'Pending',   value: orders.filter(o => o.status === 'PENDING').length, color: '#ff9f0a' },
          { label: 'Revenue',   value: formatCents(revenue),                           color: '#34c759'      },
        ].map(s => (
          <div key={s.label} className="rounded-2xl bg-canvas px-5 py-4"
            style={{ border: '1px solid var(--hairline)', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4" style={{ color: s.color }} strokeWidth={1.8} />
              <p style={{ fontSize: 12, color: 'var(--ink-48)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {s.label}
              </p>
            </div>
            <p className="font-semibold" style={{ fontSize: 22, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-48" strokeWidth={1.8} />
          <input className="input-field pl-11" placeholder="Search customer…"
            value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {['ALL', 'PENDING', 'PAID', 'CANCELLED'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="rounded-pill px-4 py-2 font-semibold transition-all"
              style={{
                fontSize: 13,
                background: filter === f ? 'var(--primary)' : 'var(--canvas)',
                color:      filter === f ? '#fff'           : 'var(--ink-48)',
                border:     filter === f ? '1px solid var(--primary)' : '1px solid var(--hairline)',
              }}>
              {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-7 h-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="rounded-2xl bg-canvas overflow-hidden"
          style={{ border: '1px solid var(--hairline)', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--divider-soft)' }}>
                {['Customer', 'Service', 'Book', 'Amount', 'Date', 'Status'].map(h => (
                  <th key={h} className="text-left px-5 py-3 font-semibold"
                    style={{ fontSize: 11, color: 'var(--ink-48)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, i) => (
                <tr key={o.id}
                  style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--divider-soft)' : 'none' }}>
                  <td className="px-5 py-3.5">
                    <p className="font-medium" style={{ fontSize: 13, color: 'var(--ink)' }}>{o.user.name}</p>
                    <p style={{ fontSize: 11, color: 'var(--ink-48)' }}>{o.user.email}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p style={{ fontSize: 13, color: 'var(--ink-80)' }}>{SERVICE_LABELS[o.serviceType] ?? o.serviceType}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p style={{ fontSize: 13, color: 'var(--ink-80)' }}>{o.book?.title ?? '—'}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium" style={{ fontSize: 13 }}>{formatCents(o.amount)}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p style={{ fontSize: 13, color: 'var(--ink-48)' }}>{formatDate(o.createdAt)}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={o.status} />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center" style={{ color: 'var(--ink-48)', fontSize: 14 }}>
                    No orders match your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
