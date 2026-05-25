import { PenLine, Image, Globe, Megaphone, ShieldCheck, BarChart3 } from 'lucide-react'
import AnimateIn from '@/components/ui/AnimateIn'

const SERVICES = [
  {
    icon: PenLine,
    title: 'Expert Editing',
    description:
      'Developmental, copy, and line editing from professional editors who polish your manuscript without erasing your voice.',
  },
  {
    icon: Image,
    title: 'Cover Design',
    description:
      'Award-winning designers craft covers that command attention on shelves and storefronts — in every genre.',
  },
  {
    icon: Globe,
    title: 'Global Distribution',
    description:
      'Reach readers in 60+ countries across Amazon, Apple Books, Barnes & Noble, Kobo, and 40+ other platforms.',
  },
  {
    icon: Megaphone,
    title: 'Marketing & PR',
    description:
      'Targeted campaigns, press releases, author newsletters, and social strategy that connect your book with the right audience.',
  },
  {
    icon: ShieldCheck,
    title: 'Rights Management',
    description:
      'Navigate publishing rights, royalty structures, and licensing agreements with guidance from our publishing legal team.',
  },
  {
    icon: BarChart3,
    title: 'Sales Analytics',
    description:
      'Real-time dashboards tracking sales, page reads, and revenue across every channel — so you always know how your book is performing.',
  },
]

export default function Features() {
  return (
    <section className="tile-parchment">
      <div className="container-apple">

        {/* ── Header ── */}
        <AnimateIn className="text-center mb-16">
          <h2
            className="text-ink font-semibold"
            style={{
              fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
              fontSize: 'clamp(32px, 4.5vw, 40px)',
              lineHeight: 1.1,
              letterSpacing: '-0.374px',
            }}
          >
            Everything You Need to Publish
          </h2>
          <p
            className="text-ink-48 mt-4 mx-auto"
            style={{ fontSize: 21, lineHeight: 1.4, letterSpacing: '0.2px', maxWidth: 480 }}
          >
            From first draft to global distribution — we handle every step.
          </p>
        </AnimateIn>

        {/* ── Service cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((service, i) => (
            <AnimateIn key={service.title} delay={i * 70}>
              <div
                className="group h-full flex flex-col rounded-lg p-8 bg-canvas transition-shadow duration-300 hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
                style={{ border: '1px solid var(--hairline)' }}
              >
                {/* Icon badge */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 flex-shrink-0 transition-colors duration-200"
                  style={{ background: 'rgba(0, 102, 204, 0.08)' }}
                >
                  <service.icon
                    className="w-[18px] h-[18px] text-primary"
                    strokeWidth={1.7}
                  />
                </div>

                <h3
                  className="text-ink font-semibold mb-2"
                  style={{ fontSize: 19, letterSpacing: '-0.2px', lineHeight: 1.2 }}
                >
                  {service.title}
                </h3>
                <p
                  className="text-ink-48 leading-relaxed"
                  style={{ fontSize: 15, letterSpacing: '-0.16px', lineHeight: 1.55 }}
                >
                  {service.description}
                </p>
              </div>
            </AnimateIn>
          ))}
        </div>

      </div>
    </section>
  )
}
