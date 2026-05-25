import Link from 'next/link'
import { BookOpen } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-5"
      style={{ background: 'var(--canvas-parchment)' }}
    >
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2 mb-10 select-none group"
      >
        <BookOpen
          className="w-5 h-5 text-primary transition-transform duration-200 group-hover:scale-110"
          strokeWidth={1.75}
        />
        <span
          className="text-ink font-semibold"
          style={{ fontSize: 15, letterSpacing: '-0.2px' }}
        >
          Smart Book Publishing
        </span>
      </Link>

      {children}
    </div>
  )
}
