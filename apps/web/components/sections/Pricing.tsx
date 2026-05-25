'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check } from 'lucide-react'
import AnimateIn from '@/components/ui/AnimateIn'
import { cn } from '@/lib/utils'

const PLANS = [
  {
    name: 'Starter',
    monthlyPrice: 97,
    annualPrice: 77,
    description: 'Everything you need to get your first book into readers\' hands.',
    featured: false,
    features: [
      'Manuscript editing (2 rounds)',
      'Professional cover design',
      'eBook formatting & layout',
      'Distribution to 40+ platforms',
      'Author dashboard access',
      'Email support',
    ],
    cta: 'Get started',
    ctaHref: '/contact?plan=starter',
  },
  {
    name: 'Author',
    monthlyPrice: 197,
    annualPrice: 157,
    description: 'The complete publishing suite for authors serious about their career.',
    featured: true,
    features: [
      'Everything in Starter',
      'Print edition setup & ISBN',
      'Audiobook production',
      '3 press releases',
      'Author website (5 pages)',
      'Marketing strategy session',
      'Priority support',
    ],
    cta: 'Start publishing',
    ctaHref: '/contact?plan=author',
  },
  {
    name: 'Publisher',
    monthlyPrice: 397,
    annualPrice: 317,
    description: 'White-glove service for authors who want to publish at scale.',
    featured: false,
    features: [
      'Everything in Author',
      'Dedicated publishing manager',
      'Full PR campaign (3 months)',
      'BookTok & influencer outreach',
      'Bookstore placement support',
      'Monthly analytics reports',
      'Quarterly strategy reviews',
    ],
    cta: 'Contact us',
    ctaHref: '/contact?plan=publisher',
  },
] as const

export default function Pricing() {
  const [annual, setAnnual] = useState(false)

  return (
    <section className="tile-light">
      <div className="container-apple">

        {/* ── Header ── */}
        <AnimateIn className="text-center mb-12">
          <p
            className="text-primary font-semibold uppercase mb-4"
            style={{ fontSize: 12, letterSpacing: '0.1em' }}
          >
            Pricing
          </p>
          <h2
            className="text-ink font-semibold mb-4"
            style={{
              fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
              fontSize: 'clamp(32px, 4.5vw, 40px)',
              lineHeight: 1.1,
              letterSpacing: '-0.374px',
            }}
          >
            Simple, Transparent Pricing
          </h2>
          <p
            className="text-ink-48 mx-auto mb-10"
            style={{ fontSize: 19, lineHeight: 1.4, maxWidth: 460 }}
          >
            No hidden fees. No long-term contracts. Cancel anytime.
          </p>

          {/* ── Toggle ── */}
          <div className="inline-flex items-center gap-4">
            <span
              className={cn('transition-colors duration-150', !annual ? 'text-ink' : 'text-ink-48')}
              style={{ fontSize: 15, letterSpacing: '-0.16px' }}
            >
              Monthly
            </span>

            <button
              role="switch"
              aria-checked={annual}
              onClick={() => setAnnual(a => !a)}
              className="relative w-[44px] h-[26px] rounded-full transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-focus"
              style={{ background: annual ? 'var(--primary)' : 'var(--surface-chip)' }}
            >
              <span
                className="absolute top-[3px] left-[3px] w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200"
                style={{ transform: annual ? 'translateX(18px)' : 'translateX(0)' }}
              />
            </button>

            <span
              className={cn('transition-colors duration-150', annual ? 'text-ink' : 'text-ink-48')}
              style={{ fontSize: 15, letterSpacing: '-0.16px' }}
            >
              Annual
              <span
                className="ml-2 inline-flex items-center rounded-pill px-2 py-0.5 text-white font-semibold"
                style={{ fontSize: 11, background: 'var(--primary)', letterSpacing: '0.02em' }}
              >
                Save 20%
              </span>
            </span>
          </div>
        </AnimateIn>

        {/* ── Plan cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {PLANS.map((plan, i) => (
            <AnimateIn key={plan.name} delay={i * 80}>
              <div
                className={cn(
                  'relative flex flex-col rounded-2xl p-8 h-full transition-shadow duration-300',
                  plan.featured
                    ? 'bg-canvas shadow-[0_8px_40px_rgba(0,0,0,0.10)]'
                    : 'bg-canvas-parchment hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]',
                )}
                style={{
                  border: plan.featured
                    ? '2px solid var(--primary)'
                    : '1px solid var(--hairline)',
                }}
              >
                {/* Popular badge */}
                {plan.featured && (
                  <div
                    className="absolute -top-[13px] left-1/2 -translate-x-1/2 px-4 py-1 rounded-pill text-white font-semibold"
                    style={{ background: 'var(--primary)', fontSize: 12, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}
                  >
                    Most Popular
                  </div>
                )}

                {/* Plan name */}
                <p
                  className="text-primary font-semibold mb-1"
                  style={{ fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase' }}
                >
                  {plan.name}
                </p>

                {/* Price */}
                <div className="flex items-end gap-1 mb-3">
                  <span
                    className="text-ink font-semibold leading-none"
                    style={{
                      fontFamily: "'SF Pro Display', system-ui, sans-serif",
                      fontSize: 48,
                      letterSpacing: '-1px',
                    }}
                  >
                    ${annual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span
                    className="text-ink-48 mb-1"
                    style={{ fontSize: 15, letterSpacing: '-0.16px' }}
                  >
                    /mo
                  </span>
                </div>

                {annual && (
                  <p
                    className="text-ink-48 mb-3 -mt-1"
                    style={{ fontSize: 13, letterSpacing: '-0.12px' }}
                  >
                    ${plan.annualPrice * 12} billed annually
                  </p>
                )}

                <p
                  className="text-ink-48 mb-7"
                  style={{ fontSize: 15, lineHeight: 1.5, letterSpacing: '-0.16px' }}
                >
                  {plan.description}
                </p>

                {/* CTA */}
                <Link
                  href={plan.ctaHref}
                  className={cn(
                    'inline-flex items-center justify-center rounded-pill font-normal transition-all duration-150 active:scale-95 mb-8',
                    plan.featured
                      ? 'bg-primary text-white hover:opacity-90'
                      : 'bg-canvas text-primary border border-primary hover:bg-primary hover:text-white',
                  )}
                  style={{ fontSize: 15, padding: '10px 20px', letterSpacing: '-0.16px' }}
                >
                  {plan.cta}
                </Link>

                {/* Features */}
                <ul className="flex flex-col gap-3">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-3">
                      <div
                        className="mt-0.5 flex-shrink-0 w-[18px] h-[18px] rounded-full flex items-center justify-center"
                        style={{ background: plan.featured ? 'rgba(0,102,204,0.1)' : 'rgba(0,0,0,0.06)' }}
                      >
                        <Check className="w-[10px] h-[10px] text-primary" strokeWidth={2.5} />
                      </div>
                      <span
                        className="text-ink-80"
                        style={{ fontSize: 14, lineHeight: 1.5, letterSpacing: '-0.16px' }}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

              </div>
            </AnimateIn>
          ))}
        </div>

      </div>
    </section>
  )
}
