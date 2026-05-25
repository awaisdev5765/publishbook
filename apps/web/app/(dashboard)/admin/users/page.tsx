'use client'

import { useState, useEffect } from 'react'
import { Search, Shield, User, BookOpen } from 'lucide-react'
import api from '@/lib/api'

interface UserRow {
  id: string; name: string; email: string; role: string
  avatarUrl: string | null; createdAt: string
}

const ROLE_STYLES: Record<string, { bg: string; text: string }> = {
  ADMIN:  { bg: 'rgba(255,149,0,0.12)',  text: '#ff9f0a' },
  AUTHOR: { bg: 'rgba(52,199,89,0.12)',  text: '#34c759' },
  CLIENT: { bg: 'rgba(0,102,204,0.12)',  text: '#0066cc' },
}

function RoleBadge({ role }: { role: string }) {
  const s = ROLE_STYLES[role] ?? ROLE_STYLES.CLIENT
  return (
    <span className="inline-block px-2.5 py-0.5 rounded-full font-semibold capitalize"
      style={{ fontSize: 11, background: s.bg, color: s.text }}>
      {role.toLowerCase()}
    </span>
  )
}

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(' ')
  const text  = parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 2)
  return (
    <span className="inline-flex items-center justify-center rounded-full font-semibold text-white shrink-0"
      style={{ width: 34, height: 34, fontSize: 12, background: 'var(--primary)' }}>
      {text.toUpperCase()}
    </span>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function AdminUsersPage() {
  const [users,   setUsers]   = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [query,   setQuery]   = useState('')
  const [saving,  setSaving]  = useState<string | null>(null)

  const load = () =>
    api.get<UserRow[]>('/users')
      .then(r => setUsers(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  async function changeRole(id: string, role: string) {
    setSaving(id)
    await api.patch(`/users/${id}/role`, { role }).catch(() => {})
    await load()
    setSaving(null)
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(query.toLowerCase()) ||
    u.email.toLowerCase().includes(query.toLowerCase()),
  )

  const roleIcon = (role: string) => {
    if (role === 'ADMIN')  return <Shield   className="w-3.5 h-3.5" />
    if (role === 'AUTHOR') return <BookOpen className="w-3.5 h-3.5" />
    return <User className="w-3.5 h-3.5" />
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-semibold" style={{ fontSize: 26, color: 'var(--ink)' }}>Users</h1>
          <p style={{ color: 'var(--ink-48)', fontSize: 14, marginTop: 2 }}>
            {users.length} registered {users.length === 1 ? 'user' : 'users'}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-48" strokeWidth={1.8} />
        <input
          className="input-field pl-11"
          placeholder="Search by name or email…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
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
                {['User', 'Role', 'Joined', 'Change role'].map(h => (
                  <th key={h} className="text-left px-5 py-3 font-semibold"
                    style={{ fontSize: 11, color: 'var(--ink-48)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id}
                  style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--divider-soft)' : 'none' }}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Initials name={u.name} />
                      <div>
                        <p className="font-medium" style={{ fontSize: 14, color: 'var(--ink)' }}>{u.name}</p>
                        <p style={{ fontSize: 12, color: 'var(--ink-48)' }}>{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5"><RoleBadge role={u.role} /></td>
                  <td className="px-5 py-3.5">
                    <p style={{ fontSize: 13, color: 'var(--ink-48)' }}>{formatDate(u.createdAt)}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      {(['CLIENT', 'AUTHOR', 'ADMIN'] as const).filter(r => r !== u.role).map(r => (
                        <button
                          key={r}
                          disabled={saving === u.id}
                          onClick={() => changeRole(u.id, r)}
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-colors hover:bg-canvas-parchment"
                          style={{
                            fontSize: 12, border: '1px solid var(--hairline)',
                            color: 'var(--ink-48)',
                            opacity: saving === u.id ? 0.5 : 1,
                          }}
                        >
                          {roleIcon(r)}
                          {r.toLowerCase()}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center"
                    style={{ color: 'var(--ink-48)', fontSize: 14 }}>
                    No users match "{query}"
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
