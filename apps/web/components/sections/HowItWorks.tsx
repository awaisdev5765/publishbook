import { FileUp, Wand2, Rocket } from 'lucide-react'
import AnimateIn from '@/components/ui/AnimateIn'

const STEPS = [
  {
    number: '01',
    icon: FileUp,
    title: 'Submit Your Manuscript',
    description:
      'Upload your draft — any format, any stage. Your dedicated publishing manager reviews it within 48 hours and maps out a personalised publishing plan.',
  },
  {
    number: '02',
    icon: Wand2,
    title: 'We Craft Your Book',
    description:
      'Our editors, designers, and formatters work in parallel. You review, we refine — until every page looks and reads exactly as you envisioned.',
  },
  {
    number: '03',
    icon: Rocket,
    title: 'Publish & Grow',
    description:
      'We distribute to 60+ global platforms on launch day, then activate your marketing campaign to drive readers, reviews, and revenue.',
  },
]

export default function HowItWorks() {
  return (
    <section className="tile-light">
      <div className="container-apple">

        {/* ── Header ── */}
        <AnimateIn className="text-center mb-20">
          <p
            className="text-primary font-semibold uppercase mb-4"
            style={{ fontSize: 12, letterSpacing: '0.1em' }}
          >
            The Process
          </p>
          <h2
            className="text-ink font-semibold"
            style={{
              fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
              fontSize: 'clamp(32px, 4.5vw, 40px)',
              lineHeight: 1.1,
              letterSpacing: '-0.374px',
            }}
          >
            From Manuscript to Bestseller
            <br className="hidden sm:block" />
            {' '}in Three Steps
          </h2>
        </AnimateIn>

        {/* ── Steps ── */}
        <div className="relative flex flex-col md:flex-row gap-12 md:gap-0">

          {STEPS.map((step, i) => (
            <div key={step.number} className="relative flex md:flex-col md:flex-1 gap-6 md:gap-0 md:items-start">

              {/* Connector line (between steps, desktop only) */}
              {i < STEPS.length - 1 && (
                <div
                  aria-hidden="true"
                  className="hidden md:block absolute top-[22px] left-[calc(50%+28px)] right-[-calc(50%-28px)] h-px"
                  style={{ background: 'linear-gradient(to right, var(--hairline) 0%, var(--hairline) 100%)', borderTop: '2px dashed var(--divider-soft)' }}
                />
              )}

              {/* Vertical connector (mobile) */}
              {i < STEPS.length - 1 && (
                <div
                  aria-hidden="true"
                  className="md:hidden absolute left-[21px] top-[44px] bottom-[-48px] w-px"
                  style={{ borderLeft: '2px dashed var(--divider-soft)' }}
                />
              )}

              <AnimateIn delay={i * 120} className="md:w-full flex md:flex-col items-start md:items-start gap-6 md:gap-0">

                {/* Number badge */}
                <div
                  className="relative z-10 flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center font-semibold text-white flex-none md:mb-6"
                  style={{ background: 'var(--primary)', fontSize: 13, letterSpacing: '0.02em' }}
                >
                  {step.number}
                </div>

                {/* Content */}
                <div className="flex-1 md:pr-8">
                  {/* Icon */}
                  <div
                    className="hidden md:flex w-12 h-12 rounded-xl items-center justify-center mb-5"
                    style={{ background: 'rgba(0, 102, 204, 0.06)' }}
                  >
                    <step.icon className="w-5 h-5 text-primary" strokeWidth={1.6} />
                  </div>

                  <h3
                    className="text-ink font-semibold mb-3"
                    style={{ fontSize: 21, letterSpacing: '-0.2px', lineHeight: 1.2 }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-ink-48"
                    style={{ fontSize: 15, letterSpacing: '-0.16px', lineHeight: 1.6 }}
                  >
                    {step.description}
                  </p>
                </div>

              </AnimateIn>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
