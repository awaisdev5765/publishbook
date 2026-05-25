'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Users, BookMarked, ShoppingBag, MessageSquare, ArrowRight } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import api from '@/lib/api'

interface Order {
  id: string; serviceType: string; amount: number; status: string
  createdAt: string
  user: { name: string; email: string }
  book: { title: string } | null
}
interface BlogPost {
  id: string; title: string; slug: string; isPublished: boolean
  createdAt: string; author: { name: string }
}
interface Contact {
  id: string; name: string; email: string; subject: string | null; isRead: boolean; createdAt: string
}
interface User { id: string; name: string; email: string; role: string; createdAt: string }

function formatCents(c: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(c / 100)
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ── SVG Bar Chart ──────────────────────────────────────────────────────────────
function RevenueChart({ orders }: { orders: Order[] }) {
  const W = 600, H = 160, BARS = 14, PAD = 32

  // last 14 days
  const days = Array.from({ length: BARS }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (BARS - 1 - i))
    return d.toISOString().slice(0, 10)
  })

  const byDay = days.map(day => ({
    label: new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: orders
      .filter(o => o.status === 'PAID' && o.createdAt.slice(0, 10) === day)
      .reduce((s, o) => s + o.amount, 0),
  }))

  const max = Math.max(...byDay.map(d => d.value), 1)
  const barW = (W - PAD * 2) / BARS
  const gap  = barW * 0.25

  return (
    <svg viewBox={`0 0 ${W} ${H + 24}`} className="w-full" style={{ overflow: 'visible' }}>
      {byDay.map((d, i) => {
        const bh  = Math.max((d.value / max) * H, 2)
        const x   = PAD + i * barW + gap / 2
        const y   = H - bh
        const bw  = barW - gap
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={bw} height={bh} rx={4}
              fill={d.value > 0 ? 'var(--primary)' : 'rgba(0,102,204,0.12)'} />
            {i % 3 === 0 && (
              <text x={x + bw / 2} y={H + 16} textAnchor="middle"
                style={{ fontSize: 9, fill: 'var(--ink-48)', fontFamily: 'system-ui' }}>
                {d.label}
              </text>
            )}
            {d.value > 0 && (
              <title>{d.label}: {formatCents(d.value)}</title>
            )}
          </g>
        )
      })}
    </svg>
  )
}

function StatCard({ icon: Icon, label, value, sub, color, href }: {
  icon: React.ElementType; label: string; value: number | string
  sub?: string; color?: string; href: string
}) {
  return (
    <Link href={href}
      className="flex flex-col gap-3 rounded-2xl bg-canvas p-6 transition-all duration-200 hover:-translate-y-0.5 group"
      style={{ border: '1px solid var(--hairline)', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center rounded-xl"
          style={{ width: 40, height: 40, background: `${color ?? 'rgba(0,102,204,'}0.1)` }}>
          <Icon className="w-5 h-5" style={{ color: color ?? 'var(--primary)' }} strokeWidth={1.7} />
        </div>
        <ArrowRight className="w-4 h-4 text-ink-48 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div>
        <p className="text-ink font-semibold" style={{ fontSize: 28, lineHeight: 1 }}>{value}</p>
        <p className="text-ink-48 mt-1" style={{ fontSize: 14 }}>{label}</p>
        {sub && <p style={{ fontSize: 12, color: 'var(--ink-48)', marginTop: 2 }}>{sub}</p>}
      </div>
    </Link>
  )
}

export default function AdminPage() {
  const { user } = useAuth()
  const [orders,   setOrders]   = useState<Order[]>([])
  const [posts,    setPosts]    = useState<BlogPost[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [users,    setUsers]    = useState<User[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    if (user?.role !== 'ADMIN') { window.location.href = '/dashboard'; return }
    Promise.all([
      api.get<Order[]>('/orders'),
      api.get<BlogPost[]>('/blog/admin'),
      api.get<Contact[]>('/contact'),
      api.get<User[]>('/users'),
    ]).then(([o, p, c, u]) => {
      setOrders(o.data)
      setPosts(p.data)
      setContacts(c.data)
      setUsers(u.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [user])

  const revenue        = orders.filter(o => o.status === 'PAID').reduce((s, o) => s + o.amount, 0)
  const pendingOrders  = orders.filter(o => o.status === 'PENDING').length
  const unreadContacts = contacts.filter(c => !c.isRead).length
  const draftPosts     = posts.filter(p => !p.isPublished)
  const recentOrders   = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6)

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-semibold" style={{ fontSize: 28, color: 'var(--ink)', letterSpacing: '-0.3px' }}>
          Admin Overview
        </h1>
        <p style={{ color: 'var(--ink-48)', fontSize: 15, marginTop: 4 }}>
          Platform stats and activity at a glance.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-7 h-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Users}        label="Total users"      value={users.length}        href="/admin/users"   color="rgba(0,102,204,0.9)"    />
            <StatCard icon={BookMarked}   label="Total books"      value={orders.length > 0 ? orders.length : '0'} href="/admin/orders"  color="rgba(52,199,89,0.9)"   />
            <StatCard icon={ShoppingBag}  label="Pending orders"   value={pendingOrders}        sub={`${formatCents(revenue)} revenue`} href="/admin/orders" color="rgba(255,149,0,0.9)" />
            <StatCard icon={MessageSquare} label="Unread messages" value={unreadContacts}        sub={`${contacts.length} total`}        href="/admin/contact" color="rgba(255,59,48,0.9)"  />
          </div>

          {/* Revenue chart + content queue row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

            {/* Revenue chart */}
            <div className="lg:col-span-2 rounded-2xl bg-canvas p-6"
              style={{ border: '1px solid var(--hairline)', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold" style={{ fontSize: 16, color: 'var(--ink)' }}>Revenue (last 14 days)</h2>
                <p className="font-semibold" style={{ fontSize: 18, color: 'var(--primary)' }}>{formatCents(revenue)}</p>
              </div>
              <RevenueChart orders={orders} />
            </div>

            {/* Blog approval queue */}
            <div className="rounded-2xl bg-canvas"
              style={{ border: '1px solid var(--hairline)', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--divider-soft)' }}>
                <h2 className="font-semibold" style={{ fontSize: 16, color: 'var(--ink)' }}>Draft posts</h2>
                <Link href="/admin/blog" className="text-primary hover:underline" style={{ fontSize: 13 }}>Manage</Link>
              </div>
              {draftPosts.length === 0 ? (
                <div className="flex items-center justify-center h-24 text-ink-48" style={{ fontSize: 14 }}>
                  All posts published ✓
                </div>
              ) : (
                <ul className="divide-y divide-divider-soft">
                  {draftPosts.slice(0, 5).map(post => (
                    <li key={post.id} className="px-5 py-3">
                      <p className="font-medium truncate" style={{ fontSize: 13, color: 'var(--ink)' }}>{post.title}</p>
                      <p style={{ fontSize: 11, color: 'var(--ink-48)', marginTop: 2 }}>
                        {post.author.name} · {formatDate(post.createdAt)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Recent orders table */}
          <div className="rounded-2xl bg-canvas overflow-hidden"
            style={{ border: '1px solid var(--hairline)', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--divider-soft)' }}>
              <h2 className="font-semibold" style={{ fontSize: 16, color: 'var(--ink)' }}>Recent Orders</h2>
              <Link href="/admin/orders" className="flex items-center gap-1 text-primary hover:underline" style={{ fontSize: 13 }}>
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {recentOrders.length === 0 ? (
              <div className="flex items-center justify-center h-20 text-ink-48" style={{ fontSize: 14 }}>
                No orders yet
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--divider-soft)' }}>
                    {['Customer', 'Service', 'Amount', 'Date', 'Status'].map(h => (
                      <th key={h} className="text-left px-5 py-3 font-semibold"
                        style={{ fontSize: 11, color: 'var(--ink-48)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o, i) => (
                    <tr key={o.id} style={{ borderBottom: i < recentOrders.length - 1 ? '1px solid var(--divider-soft)' : 'none' }}>
                      <td className="px-5 py-3.5">
                        <p className="font-medium" style={{ fontSize: 13, color: 'var(--ink)' }}>{o.user.name}</p>
                        <p style={{ fontSize: 11, color: 'var(--ink-48)' }}>{o.user.email}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p style={{ fontSize: 13, color: 'var(--ink-80)' }}>
                          {o.serviceType.replace('_', ' ').toLowerCase()}
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium" style={{ fontSize: 13 }}>{formatCents(o.amount)}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p style={{ fontSize: 13, color: 'var(--ink-48)' }}>{formatDate(o.createdAt)}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-block px-2.5 py-0.5 rounded-full font-semibold capitalize"
                          style={{
                            fontSize: 11,
                            background: o.status === 'PAID' ? 'rgba(52,199,89,0.12)' : o.status === 'PENDING' ? 'rgba(255,149,0,0.12)' : 'rgba(255,59,48,0.12)',
                            color:      o.status === 'PAID' ? '#34c759'             : o.status === 'PENDING' ? '#ff9f0a'              : '#ff3b30',
                          }}>
                          {o.status.toLowerCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  )
}
