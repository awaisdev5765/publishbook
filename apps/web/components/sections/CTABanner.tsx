import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import AnimateIn from '@/components/ui/AnimateIn'

export default function CTABanner() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: 'var(--surface-tile-1)', paddingTop: 100, paddingBottom: 100 }}
    >
      {/* Subtle radial highlight */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(0, 102, 204, 0.12) 0%, transparent 70%)',
        }}
      />

      <div className="container-narrow relative z-10 text-center">

        <AnimateIn>
          <p
            className="font-semibold uppercase mb-6"
            style={{ color: 'var(--primary-on-dark)', fontSize: 12, letterSpacing: '0.1em' }}
          >
            Start Today
          </p>

          <h2
            className="text-white font-semibold mb-6"
            style={{
              fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
              fontSize: 'clamp(32px, 5vw, 48px)',
              lineHeight: 1.08,
              letterSpacing: '-0.3px',
            }}
          >
            Ready to Share
            <br />
            Your Story?
          </h2>

          <p
            className="mx-auto mb-10"
            style={{
              color: 'var(--body-muted)',
              fontSize: 19,
              lineHeight: 1.45,
              letterSpacing: '0.1px',
              maxWidth: 440,
            }}
          >
            Join 2,400+ authors who trusted Smart Book Publishing to bring
            their vision to life — from first draft to global stage.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="btn-primary"
              style={{ fontSize: 17, padding: '13px 28px' }}
            >
              Start Your Journey
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 transition-opacity duration-150 hover:opacity-70"
              style={{ color: 'var(--primary-on-dark)', fontSize: 17, letterSpacing: '-0.374px' }}
            >
              View all services
              <ArrowRight className="w-4 h-4" strokeWidth={1.6} />
            </Link>
          </div>
        </AnimateIn>

      </div>
    </section>
  )
}
