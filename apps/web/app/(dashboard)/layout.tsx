'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BookOpen, LayoutDashboard, BookMarked, ShoppingBag,
  Users, FileText, MessageSquare, Info, LogOut, Menu, X,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

const CLIENT_NAV = [
  { href: '/dashboard',        label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/dashboard/books',  label: 'My Books',   icon: BookMarked      },
  { href: '/dashboard/orders', label: 'My Orders',  icon: ShoppingBag     },
]

const ADMIN_NAV = [
  { href: '/admin',          label: 'Overview',  icon: LayoutDashboard },
  { href: '/admin/users',    label: 'Users',     icon: Users           },
  { href: '/admin/orders',   label: 'Orders',    icon: ShoppingBag     },
  { href: '/admin/blog',     label: 'Blog',      icon: FileText        },
  { href: '/admin/about',    label: 'About',     icon: Info            },
  { href: '/admin/contact',  label: 'Contact',   icon: MessageSquare   },
]

function NavItem({ href, label, icon: Icon, active }: {
  href: string; label: string; icon: React.ElementType; active: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
        active
          ? 'bg-white/10 text-white'
          : 'text-white/60 hover:text-white hover:bg-white/6',
      )}
      style={{ fontSize: 14 }}
    >
      <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.7} />
      {label}
    </Link>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => { setSidebarOpen(false) }, [pathname])

  useEffect(() => {
    if (!isLoading && !user) {
      // Cookie is already cleared by AuthContext on failed refresh.
      // Use replace so back-button doesn't loop back into the dashboard.
      window.location.replace(`/login?from=${encodeURIComponent(pathname)}`)
    }
  // pathname intentionally omitted — only react to auth state changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, user])

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--canvas-parchment)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  const isAdmin = user.role === 'ADMIN'
  const nav = isAdmin ? ADMIN_NAV : CLIENT_NAV

  const Sidebar = (
    <aside
      className="flex flex-col h-full"
      style={{ background: 'var(--surface-tile-1)', width: 240 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <BookOpen className="w-5 h-5 text-primary shrink-0" strokeWidth={1.75} />
        <span className="text-white font-semibold" style={{ fontSize: 14, letterSpacing: '-0.16px' }}>
          Smart Book
        </span>
      </div>

      {/* Role badge */}
      <div className="px-5 pt-4 pb-2">
        <span
          className="inline-block px-2.5 py-0.5 rounded-full text-white font-semibold uppercase"
          style={{ fontSize: 10, letterSpacing: '0.06em', background: isAdmin ? 'rgba(255,149,0,0.25)' : 'rgba(41,151,255,0.15)', color: isAdmin ? '#ff9f0a' : '#2997ff' }}
        >
          {isAdmin ? 'Admin' : user.role === 'AUTHOR' ? 'Author' : 'Client'}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 flex flex-col gap-1 overflow-y-auto">
        {nav.map(item => {
          const active = item.href === '/dashboard' || item.href === '/admin'
            ? pathname === item.href
            : pathname.startsWith(item.href)
          return <NavItem key={item.href} {...item} active={active} />
        })}
      </nav>

      {/* User + logout */}
      <div className="px-3 py-4 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div
            className="flex items-center justify-center rounded-full shrink-0 font-semibold text-white"
            style={{ width: 32, height: 32, fontSize: 12, background: 'var(--primary)' }}
          >
            {user.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold truncate" style={{ fontSize: 13 }}>{user.name}</p>
            <p className="text-white/50 truncate" style={{ fontSize: 11 }}>{user.email}</p>
          </div>
          <button
            onClick={async () => { await logout(); window.location.href = '/' }}
            className="text-white/40 hover:text-white/80 transition-colors"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.7} />
          </button>
        </div>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--canvas-parchment)' }}>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col shrink-0" style={{ width: 240 }}>
        {Sidebar}
      </div>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="flex flex-col" style={{ width: 240 }}>{Sidebar}</div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header
          className="flex items-center gap-3 px-6 shrink-0"
          style={{
            height: 56,
            background: 'var(--canvas)',
            borderBottom: '1px solid var(--divider-soft)',
          }}
        >
          <button
            className="lg:hidden flex items-center justify-center text-ink-48 hover:text-ink"
            style={{ width: 36, height: 36 }}
            onClick={() => setSidebarOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-ink-48" style={{ fontSize: 13 }}>
            <Link href="/" className="hover:text-ink transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-ink font-medium capitalize">
              {pathname.split('/').filter(Boolean).slice(-1)[0]?.replace(/-/g, ' ') || 'Dashboard'}
            </span>
          </nav>

          <div className="flex-1" />

          <Link href="/" className="text-ink-48 hover:text-primary transition-colors" style={{ fontSize: 13 }}>
            ← Back to site
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
