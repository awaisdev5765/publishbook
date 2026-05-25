import Link from 'next/link'
import { BookOpen, Twitter, Instagram, Linkedin, Facebook, Youtube } from 'lucide-react'

const NAV = [
  {
    heading: 'Services',
    links: [
      { label: 'Manuscript Editing',  href: '/services#editing'      },
      { label: 'Cover Design',        href: '/services#cover-design'  },
      { label: 'Global Distribution', href: '/services#distribution'  },
      { label: 'Marketing & PR',      href: '/services#marketing'     },
      { label: 'Audiobook Production',href: '/services#audiobook'     },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Author Blog',        href: '/blog'           },
      { label: 'Publishing Guide',   href: '/blog/guide'     },
      { label: 'Pricing',            href: '/#pricing'       },
      { label: 'FAQ',                href: '/faq'            },
      { label: 'Success Stories',    href: '/testimonials'   },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us',   href: '/about'    },
      { label: 'Our Team',   href: '/about#team' },
      { label: 'Press',      href: '/press'    },
      { label: 'Careers',    href: '/careers'  },
      { label: 'Contact',    href: '/contact'  },
    ],
  },
]

const SOCIALS = [
  { icon: Twitter,   label: 'Twitter / X',   href: '#' },
  { icon: Instagram, label: 'Instagram',      href: '#' },
  { icon: Linkedin,  label: 'LinkedIn',       href: '#' },
  { icon: Facebook,  label: 'Facebook',       href: '#' },
  { icon: Youtube,   label: 'YouTube',        href: '#' },
]

const LEGAL = [
  { label: 'Privacy Policy',   href: '/privacy'  },
  { label: 'Terms of Service', href: '/terms'    },
  { label: 'Cookie Policy',    href: '/cookies'  },
]

export default function Footer() {
  return (
    <footer style={{ background: 'var(--canvas-parchment)', borderTop: '1px solid var(--divider-soft)' }}>

      {/* ── Main columns ── */}
      <div className="container-wide py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand column */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-2 select-none w-fit" aria-label="Smart Book Publishing — home">
              <BookOpen className="w-[18px] h-[18px] text-primary" strokeWidth={1.75} />
              <span
                className="text-ink font-semibold"
                style={{ fontSize: 14, letterSpacing: '-0.16px' }}
              >
                Smart Book Publishing
              </span>
            </Link>

            <p
              className="text-ink-48"
              style={{ fontSize: 13, lineHeight: 1.6, letterSpacing: '-0.12px', maxWidth: 220 }}
            >
              Where great stories find their global audience. Professional publishing for independent authors.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3 mt-1">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-ink-48 hover:text-ink transition-colors duration-150"
                >
                  <Icon className="w-[18px] h-[18px]" strokeWidth={1.6} />
                </Link>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {NAV.map(col => (
            <div key={col.heading}>
              <p
                className="text-ink font-semibold mb-4"
                style={{ fontSize: 13, letterSpacing: '-0.12px' }}
              >
                {col.heading}
              </p>
              <ul className="flex flex-col gap-3">
                {col.links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-ink-48 hover:text-ink transition-colors duration-150"
                      style={{ fontSize: 13, letterSpacing: '-0.12px', lineHeight: 1.3 }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ borderTop: '1px solid var(--divider-soft)' }}>
        <div
          className="container-wide py-5 flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <p
            className="text-ink-48 text-center sm:text-left"
            style={{ fontSize: 12, letterSpacing: '-0.12px' }}
          >
            © {new Date().getFullYear()} Smart Book Publishing. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            {LEGAL.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-ink-48 hover:text-ink transition-colors duration-150"
                style={{ fontSize: 12, letterSpacing: '-0.12px' }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

    </footer>
  )
}
