'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/',         label: 'Home'     },
  { href: '/services', label: 'Services' },
  { href: '/about',    label: 'About'    },
  { href: '/blog',     label: 'Blog'     },
  { href: '/contact',  label: 'Contact'  },
]

export default function Header() {
  const pathname    = usePathname()
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close drawer on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  // Prevent body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-canvas/80 backdrop-blur-apple border-b border-divider-soft'
            : 'bg-transparent',
        )}
        style={{ height: 52 }}
      >
        <div className="container-apple flex items-center justify-between h-full">

          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center gap-[7px] select-none group"
            aria-label="Smart Book Publishing — home"
          >
            <BookOpen
              className="w-[20px] h-[20px] text-primary flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
              strokeWidth={1.75}
            />
            <span
              className="text-ink font-semibold leading-none"
              style={{ fontSize: 15, letterSpacing: '-0.2px' }}
            >
              Smart Book Publishing
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Primary">
            {NAV_LINKS.map(({ href, label }) => {
              const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'transition-colors duration-150',
                    active ? 'text-ink font-medium' : 'text-ink-80 hover:text-ink',
                  )}
                  style={{ fontSize: 14, letterSpacing: '-0.12px' }}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* ── Desktop CTA ── */}
          <div className="hidden md:flex">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-pill border border-primary text-primary font-normal transition-all duration-150 hover:bg-primary hover:text-white active:scale-95"
              style={{ fontSize: 14, padding: '8px 18px', letterSpacing: '-0.12px' }}
            >
              Get Started
            </Link>
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            className="md:hidden flex items-center justify-center -mr-2 text-ink transition-opacity duration-150 hover:opacity-60"
            style={{ width: 44, height: 44 }}
            onClick={() => setMobileOpen(o => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen
              ? <X     className="w-[18px] h-[18px]" strokeWidth={1.8} />
              : <Menu  className="w-[18px] h-[18px]" strokeWidth={1.8} />
            }
          </button>

        </div>
      </header>

      {/* ── Mobile drawer ── */}
      <div
        aria-hidden={!mobileOpen}
        className={cn(
          'fixed inset-0 z-40 bg-canvas flex flex-col md:hidden transition-all duration-300',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        style={{ paddingTop: 52 }}
      >
        <nav className="flex flex-col" aria-label="Mobile primary">
          {NAV_LINKS.map(({ href, label }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'px-6 py-4 border-b border-divider-soft transition-colors duration-150',
                  active
                    ? 'text-ink font-medium bg-canvas-parchment'
                    : 'text-ink-80 hover:bg-canvas-parchment',
                )}
                style={{ fontSize: 17, letterSpacing: '-0.374px' }}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="px-6 py-8">
          <Link
            href="/contact"
            className="btn-primary justify-center w-full"
            onClick={() => setMobileOpen(false)}
          >
            Get Started
          </Link>
        </div>
      </div>
    </>
  )
}
