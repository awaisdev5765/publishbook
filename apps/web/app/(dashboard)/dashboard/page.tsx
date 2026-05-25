'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookMarked, ShoppingBag, Clock, CheckCircle, Plus, ArrowRight } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import api from '@/lib/api'

interface Book {
  id: string; title: string; genre: string; status: string
  createdAt: string; updatedAt: string
}
interface Order {
  id: string; serviceType: string; amount: number; status: string
  createdAt: string; book?: { title: string } | null
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT:      'rgba(142,142,147,0.15)',
  IN_REVIEW:  'rgba(255,149,0,0.15)',
  PUBLISHED:  'rgba(52,199,89,0.15)',
  PENDING:    'rgba(255,149,0,0.15)',
  PAID:       'rgba(52,199,89,0.15)',
  CANCELLED:  'rgba(255,59,48,0.15)',
}
const STATUS_TEXT: Record<string, string> = {
  DRAFT:      '#8e8e93',
  IN_REVIEW:  '#ff9f0a',
  PUBLISHED:  '#34c759',
  PENDING:    '#ff9f0a',
  PAID:       '#34c759',
  CANCELLED:  '#ff3b30',
}

function StatCard({ icon: Icon, label, value, sub, href }: {
  icon: React.ElementType; label: string; value: number | string
  sub?: string; href: string
}) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-3 rounded-2xl p-6 bg-canvas transition-all duration-200 hover:-translate-y-0.5 group"
      style={{ border: '1px solid var(--hairline)', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center rounded-xl" style={{ width: 40, height: 40, background: 'rgba(0,102,204,0.08)' }}>
          <Icon className="w-5 h-5 text-primary" strokeWidth={1.7} />
        </div>
        <ArrowRight className="w-4 h-4 text-ink-48 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
      </div>
      <div>
        <p className="text-ink font-semibold" style={{ fontSize: 28, lineHeight: 1 }}>{value}</p>
        <p className="text-ink-48 mt-1" style={{ fontSize: 14 }}>{label}</p>
        {sub && <p style={{ fontSize: 12, color: 'var(--ink-48)', marginTop: 2 }}>{sub}</p>}
      </div>
    </Link>
  )
}

function Badge({ status }: { status: string }) {
  return (
    <span
      className="inline-block px-2.5 py-0.5 rounded-full font-semibold capitalize"
      style={{
        fontSize: 11,
        background: STATUS_COLORS[status] ?? 'rgba(142,142,147,0.15)',
        color:      STATUS_TEXT[status]   ?? '#8e8e93',
      }}
    >
      {status.toLowerCase().replace('_', ' ')}
    </span>
  )
}

function formatCents(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [books,  setBooks]  = useState<Book[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<Book[]>('/books/mine'),
      api.get<Order[]>('/orders/mine'),
    ]).then(([booksRes, ordersRes]) => {
      setBooks(booksRes.data)
      setOrders(ordersRes.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const pending   = orders.filter(o => o.status === 'PENDING').length
  const paid      = orders.filter(o => o.status === 'PAID').length
  const published = books.filter(b => b.status === 'PUBLISHED').length

  return (
    <div className="max-w-5xl mx-auto">

      {/* Welcome */}
      <div className="mb-8">
        <h1 className="font-semibold" style={{ fontSize: 28, color: 'var(--ink)', letterSpacing: '-0.3px' }}>
          Welcome back, {user?.name.split(' ')[0]}
        </h1>
        <p style={{ color: 'var(--ink-48)', fontSize: 15, marginTop: 4 }}>
          Here's an overview of your publishing activity.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={BookMarked}  label="Total books"      value={loading ? '—' : books.length}   href="/dashboard/books"  />
        <StatCard icon={CheckCircle} label="Published"        value={loading ? '—' : published}       href="/dashboard/books"  />
        <StatCard icon={Clock}       label="Pending orders"   value={loading ? '—' : pending}         href="/dashboard/orders" />
        <StatCard icon={ShoppingBag} label="Paid orders"      value={loading ? '—' : paid}            href="/dashboard/orders" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent books */}
        <div className="rounded-2xl bg-canvas" style={{ border: '1px solid var(--hairline)', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--divider-soft)' }}>
            <h2 className="font-semibold" style={{ fontSize: 16, color: 'var(--ink)' }}>My Books</h2>
            <Link href="/dashboard/books" className="flex items-center gap-1 text-primary hover:underline" style={{ fontSize: 13 }}>
              <Plus className="w-3.5 h-3.5" /> Add book
            </Link>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : books.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center px-6">
              <p style={{ color: 'var(--ink-48)', fontSize: 14 }}>No books yet.</p>
              <Link href="/dashboard/books" className="text-primary hover:underline mt-1" style={{ fontSize: 13 }}>
                Add your first book →
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-divider-soft">
              {books.slice(0, 5).map(book => (
                <li key={book.id} className="flex items-center justify-between px-6 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate" style={{ fontSize: 14, color: 'var(--ink)' }}>{book.title}</p>
                    <p style={{ fontSize: 12, color: 'var(--ink-48)' }}>{book.genre} · {formatDate(book.updatedAt)}</p>
                  </div>
                  <Badge status={book.status} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent orders */}
        <div className="rounded-2xl bg-canvas" style={{ border: '1px solid var(--hairline)', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--divider-soft)' }}>
            <h2 className="font-semibold" style={{ fontSize: 16, color: 'var(--ink)' }}>Recent Orders</h2>
            <Link href="/dashboard/orders" className="text-primary hover:underline" style={{ fontSize: 13 }}>
              View all
            </Link>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center px-6">
              <p style={{ color: 'var(--ink-48)', fontSize: 14 }}>No orders yet.</p>
              <Link href="/contact" className="text-primary hover:underline mt-1" style={{ fontSize: 13 }}>
                Start a project →
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-divider-soft">
              {orders.slice(0, 5).map(order => (
                <li key={order.id} className="flex items-center justify-between px-6 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate" style={{ fontSize: 14, color: 'var(--ink)' }}>
                      {order.serviceType.replace('_', ' ')}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--ink-48)' }}>
                      {order.book?.title ?? 'No book'} · {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0 ml-4">
                    <Badge status={order.status} />
                    <p style={{ fontSize: 12, color: 'var(--ink-48)' }}>{formatCents(order.amount)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
