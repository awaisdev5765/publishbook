'use client'

import { useState, useEffect } from 'react'
import { ShoppingBag, XCircle } from 'lucide-react'
import api from '@/lib/api'

interface Order {
  id: string; serviceType: string; amount: number; status: string
  notes: string | null; createdAt: string
  book?: { id: string; title: string } | null
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  PENDING:   { bg: 'rgba(255,149,0,0.12)',  text: '#ff9f0a' },
  PAID:      { bg: 'rgba(52,199,89,0.12)',  text: '#34c759' },
  CANCELLED: { bg: 'rgba(255,59,48,0.12)',  text: '#ff3b30' },
}

function Badge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] ?? STATUS_COLORS.PENDING
  return (
    <span className="inline-block px-2.5 py-0.5 rounded-full font-semibold capitalize"
      style={{ fontSize: 11, background: c.bg, color: c.text }}>
      {status.toLowerCase()}
    </span>
  )
}

function formatCents(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const SERVICE_LABELS: Record<string, string> = {
  EDITING:      'Manuscript Editing',
  COVER_DESIGN: 'Cover Design',
  DISTRIBUTION: 'Global Distribution',
  MARKETING:    'Marketing & PR',
  AUDIOBOOK:    'Audiobook Production',
  FULL_PACKAGE: 'Full Publishing Package',
}

export default function OrdersPage() {
  const [orders,  setOrders]  = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    api.get<Order[]>('/orders/mine')
      .then(r => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function cancel(id: string) {
    if (!confirm('Cancel this order?')) return
    await api.patch(`/orders/${id}/cancel`).catch(() => {})
    load()
  }

  const total = orders.reduce((s, o) => s + (o.status === 'PAID' ? o.amount : 0), 0)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="font-semibold" style={{ fontSize: 26, color: 'var(--ink)' }}>My Orders</h1>
        <p style={{ color: 'var(--ink-48)', fontSize: 14, marginTop: 2 }}>
          Track your publishing service orders and their status.
        </p>
      </div>

      {/* Summary strip */}
      {orders.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total orders',     value: orders.length },
            { label: 'Pending',          value: orders.filter(o => o.status === 'PENDING').length },
            { label: 'Amount paid',      value: formatCents(total) },
          ].map(s => (
            <div key={s.label} className="rounded-2xl bg-canvas px-5 py-4"
              style={{ border: '1px solid var(--hairline)', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
              <p className="font-semibold text-ink" style={{ fontSize: 22 }}>{s.value}</p>
              <p style={{ color: 'var(--ink-48)', fontSize: 13, marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-7 h-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 h-40 rounded-2xl bg-canvas text-center"
          style={{ border: '1px solid var(--hairline)' }}>
          <ShoppingBag className="w-10 h-10 text-ink-48" strokeWidth={1.4} />
          <div>
            <p style={{ color: 'var(--ink-48)', fontSize: 16 }}>No orders yet.</p>
            <a href="/contact" className="text-primary hover:underline" style={{ fontSize: 13 }}>
              Start a project →
            </a>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-canvas overflow-hidden"
          style={{ border: '1px solid var(--hairline)', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--divider-soft)' }}>
                {['Service', 'Book', 'Amount', 'Date', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-5 py-3 font-semibold"
                    style={{ fontSize: 12, color: 'var(--ink-48)', letterSpacing: '0.03em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr key={order.id}
                  style={{ borderBottom: i < orders.length - 1 ? '1px solid var(--divider-soft)' : 'none' }}>
                  <td className="px-5 py-4">
                    <p className="font-medium" style={{ fontSize: 14, color: 'var(--ink)' }}>
                      {SERVICE_LABELS[order.serviceType] ?? order.serviceType}
                    </p>
                    {order.notes && (
                      <p className="truncate" style={{ fontSize: 12, color: 'var(--ink-48)', maxWidth: 180 }}>
                        {order.notes}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <p style={{ fontSize: 13, color: 'var(--ink-80)' }}>{order.book?.title ?? '—'}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium" style={{ fontSize: 14, color: 'var(--ink)' }}>{formatCents(order.amount)}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p style={{ fontSize: 13, color: 'var(--ink-48)' }}>{formatDate(order.createdAt)}</p>
                  </td>
                  <td className="px-5 py-4">
                    <Badge status={order.status} />
                  </td>
                  <td className="px-5 py-4">
                    {order.status === 'PENDING' && (
                      <button onClick={() => cancel(order.id)}
                        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-red-500 hover:bg-red-50 transition-colors"
                        style={{ fontSize: 12, border: '1px solid rgba(255,59,48,0.2)' }}>
                        <XCircle className="w-3.5 h-3.5" /> Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
