import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const STATS = [
  { value: '2,400+', label: 'Books Published'       },
  { value: '98%',    label: 'Author Satisfaction'   },
  { value: '60+',    label: 'Countries Distributed' },
]

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-canvas">

      {/* ── Subtle background radial ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 75% 55% at 50% -5%, rgba(0,102,204,0.07) 0%, transparent 65%)',
        }}
      />

      {/* ── Content ── */}
      <div className="container-narrow relative z-10 flex flex-col items-center text-center pt-[52px]">

        {/* Eyebrow — animates first */}
        <p
          className="animate-fade-up text-primary font-semibold uppercase mb-5"
          style={{
            fontSize: 12,
            letterSpacing: '0.1em',
            animationDelay: '0ms',
            animationFillMode: 'both',
          }}
        >
          Professional Book Publishing
        </p>

        {/* Headline — animates second */}
        <h1
          className="animate-fade-up text-ink font-display font-semibold mb-6 max-w-[680px]"
          style={{
            fontFamily:
              "'SF Pro Display', system-ui, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif",
            fontSize: 'clamp(38px, 6vw, 56px)',
            lineHeight: 1.07,
            letterSpacing: '-0.28px',
            animationDelay: '80ms',
            animationFillMode: 'both',
          }}
        >
          Your Story Deserves
          <br />
          to Be{' '}
          <span className="text-primary">Published.</span>
        </h1>

        {/* Sub-copy — animates third */}
        <p
          className="animate-fade-up text-ink-48 max-w-[500px] mb-10"
          style={{
            fontSize: 'clamp(19px, 2.5vw, 24px)',
            lineHeight: 1.4,
            letterSpacing: '0.1px',
            fontWeight: 400,
            animationDelay: '180ms',
            animationFillMode: 'both',
          }}
        >
          From manuscript to bestseller — expert editing, stunning cover
          design, global distribution, and targeted marketing. All under
          one roof.
        </p>

        {/* CTAs — animate fourth */}
        <div
          className="animate-fade-up flex flex-col sm:flex-row items-center gap-4"
          style={{ animationDelay: '280ms', animationFillMode: 'both' }}
        >
          <Link
            href="/contact"
            className="btn-primary"
            style={{ fontSize: 17, padding: '13px 28px' }}
          >
            Start Publishing
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-primary transition-opacity duration-150 hover:opacity-70"
            style={{ fontSize: 17, letterSpacing: '-0.374px' }}
          >
            Explore services
            <ArrowRight className="w-[16px] h-[16px]" strokeWidth={1.6} />
          </Link>
        </div>

        {/* ── Stats row — animates last ── */}
        <div
          className="animate-fade-up mt-20 flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-16"
          style={{ animationDelay: '420ms', animationFillMode: 'both' }}
        >
          {STATS.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span
                className="text-ink font-semibold leading-none"
                style={{ fontSize: 34, letterSpacing: '-0.374px' }}
              >
                {value}
              </span>
              <span
                className="text-ink-48"
                style={{ fontSize: 14, letterSpacing: '-0.224px' }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* ── Bottom fade-out ── */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, #ffffff)',
        }}
      />

    </section>
  )
}
