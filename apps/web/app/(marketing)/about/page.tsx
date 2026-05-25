const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'

interface AboutContent {
  title: string | null
  content: string
}

async function getAbout(): Promise<AboutContent | null> {
  try {
    const res = await fetch(`${API}/about`, { next: { revalidate: 60 } })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

function paragraphs(text: string) {
  return text
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean)
}

export default async function AboutPage() {
  const data = await getAbout()
  const title = data?.title || 'About Smart Book Publishing'
  const content = data?.content || 'We help independent authors publish professionally and reach global readers.'

  return (
    <div style={{ background: 'var(--canvas)', minHeight: '100vh' }}>
      <section style={{ background: 'var(--canvas-parchment)', paddingTop: 96, paddingBottom: 72 }}>
        <div className="container-apple">
          <p className="font-semibold uppercase mb-4" style={{ color: 'var(--primary)', fontSize: 12, letterSpacing: '0.1em' }}>
            Our Story
          </p>
          <h1
            className="font-semibold"
            style={{
              fontSize: 'clamp(36px, 5.5vw, 56px)',
              lineHeight: 1.08,
              letterSpacing: '-0.4px',
              color: 'var(--ink)',
              maxWidth: 900,
            }}
          >
            {title}
          </h1>
        </div>
      </section>

      <section style={{ paddingTop: 72, paddingBottom: 96 }}>
        <div className="container-apple" style={{ maxWidth: 900 }}>
          <div
            className="rounded-2xl p-8 md:p-10"
            style={{ border: '1px solid var(--hairline)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
          >
            <div className="space-y-5">
              {paragraphs(content).map((paragraph, index) => (
                <p key={index} style={{ color: 'var(--ink-80)', fontSize: 17, lineHeight: 1.75 }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
