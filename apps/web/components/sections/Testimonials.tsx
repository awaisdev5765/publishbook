import { Star } from 'lucide-react'
import AnimateIn from '@/components/ui/AnimateIn'

const TESTIMONIALS = [
  {
    quote:
      '"Working with Smart Book Publishing was a game-changer. My debut novel reached the Amazon Top 10 within its first week — and the editorial team made sure every sentence earned its place."',
    name: 'Sarah Chen',
    title: 'Author of The Midnight Garden',
    initials: 'SC',
    avatarBg: '#0066cc',
    rating: 5,
  },
  {
    quote:
      '"They preserved my voice while making the manuscript so much sharper. The cover design exceeded every expectation. I\'ve recommended Smart Book Publishing to every writer I know."',
    name: 'James O\'Brien',
    title: 'Author of Coastal Winds',
    initials: 'JO',
    avatarBg: '#272729',
    rating: 5,
  },
  {
    quote:
      '"From cover design to the marketing launch, every detail was handled with care and professionalism. I published three books through them and each one performed better than the last."',
    name: 'Maria Santos',
    title: 'Author of Beyond the Horizon',
    initials: 'MS',
    avatarBg: '#5856d6',
    rating: 5,
  },
]

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-[14px] h-[14px]" fill="#FF9F0A" color="#FF9F0A" />
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="tile-parchment">
      <div className="container-apple">

        {/* ── Header ── */}
        <AnimateIn className="text-center mb-16">
          <p
            className="text-primary font-semibold uppercase mb-4"
            style={{ fontSize: 12, letterSpacing: '0.1em' }}
          >
            Author Stories
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
            Trusted by Authors Worldwide
          </h2>
        </AnimateIn>

        {/* ── Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <AnimateIn key={t.name} delay={i * 100}>
              <div
                className="flex flex-col gap-5 h-full rounded-2xl p-8 bg-canvas"
                style={{ border: '1px solid var(--hairline)' }}
              >
                {/* Stars */}
                <StarRating count={t.rating} />

                {/* Quote */}
                <blockquote
                  className="flex-1 text-ink"
                  style={{ fontSize: 16, lineHeight: 1.6, letterSpacing: '-0.2px' }}
                >
                  {t.quote}
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3 pt-1">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold select-none"
                    style={{ background: t.avatarBg, fontSize: 13, letterSpacing: '0.02em' }}
                    aria-hidden="true"
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p
                      className="text-ink font-semibold leading-tight"
                      style={{ fontSize: 14, letterSpacing: '-0.16px' }}
                    >
                      {t.name}
                    </p>
                    <p
                      className="text-ink-48 leading-tight mt-0.5"
                      style={{ fontSize: 12, letterSpacing: '-0.12px' }}
                    >
                      {t.title}
                    </p>
                  </div>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>

      </div>
    </section>
  )
}
