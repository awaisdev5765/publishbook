import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, ArrowLeft, Tag } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'

interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  coverImageUrl: string | null
  isPublished: boolean
  publishedAt: string | null
  tags: string[]
  author: { id: string; name: string; avatarUrl: string | null }
}

async function getPost(slug: string): Promise<Post | null> {
  const res = await fetch(`${API}/blog/slug/${slug}`, { next: { revalidate: 60 } })
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to load post')
  return res.json()
}

function formatDate(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(' ')
  const text = parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 2)
  return (
    <span
      className="inline-flex items-center justify-center rounded-full font-semibold text-white"
      style={{ width: 44, height: 44, fontSize: 15, background: 'var(--primary)' }}
    >
      {text.toUpperCase()}
    </span>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Post not found' }
  return {
    title: `${post.title} | Smart Book Publishing Blog`,
    description: post.excerpt ?? undefined,
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  // Split content into paragraphs for rendering
  const paragraphs = post.content.split('\n').filter(p => p.trim())

  return (
    <div style={{ background: 'var(--canvas)', minHeight: '100vh' }}>

      {/* Back nav */}
      <div style={{ paddingTop: 24, paddingBottom: 0 }}>
        <div className="container-narrow">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 transition-colors duration-150"
            style={{ color: 'var(--ink-48)', fontSize: 15 }}
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.8} />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Hero */}
      <header style={{ paddingTop: 48, paddingBottom: 56 }}>
        <div className="container-narrow">

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map(t => (
                <Link
                  key={t}
                  href={`/blog?tag=${t}`}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 capitalize transition-opacity hover:opacity-70"
                  style={{ background: 'rgba(0,102,204,0.08)', color: 'var(--primary)', fontSize: 12, fontWeight: 600 }}
                >
                  <Tag className="w-3 h-3" strokeWidth={2} />
                  {t}
                </Link>
              ))}
            </div>
          )}

          <h1
            className="font-semibold mb-6"
            style={{
              fontFamily: "'SF Pro Display', system-ui, sans-serif",
              fontSize: 'clamp(32px, 5vw, 48px)',
              lineHeight: 1.1,
              letterSpacing: '-0.4px',
              color: 'var(--ink)',
            }}
          >
            {post.title}
          </h1>

          {/* Author / date row */}
          <div className="flex items-center gap-3 pb-8" style={{ borderBottom: '1px solid var(--hairline)' }}>
            <Initials name={post.author.name} />
            <div>
              <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink-80)' }}>{post.author.name}</p>
              {post.publishedAt && (
                <p className="flex items-center gap-1" style={{ color: 'var(--ink-48)', fontSize: 13 }}>
                  <Calendar className="w-3.5 h-3.5" strokeWidth={1.8} />
                  {formatDate(post.publishedAt)}
                </p>
              )}
            </div>
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <p
              className="mt-8 font-normal"
              style={{ color: 'var(--ink-48)', fontSize: 21, lineHeight: 1.5, fontStyle: 'italic' }}
            >
              {post.excerpt}
            </p>
          )}
        </div>
      </header>

      {/* Cover image */}
      {post.coverImageUrl && (
        <div className="container-apple mb-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="w-full rounded-2xl object-cover"
            style={{ maxHeight: 480 }}
          />
        </div>
      )}

      {/* Article content */}
      <article style={{ paddingBottom: 120 }}>
        <div className="container-narrow">
          <div
            style={{
              color: 'var(--ink)',
              fontSize: 18,
              lineHeight: 1.7,
              letterSpacing: '-0.2px',
            }}
          >
            {paragraphs.map((para, i) => (
              <p key={i} style={{ marginBottom: 24 }}>{para}</p>
            ))}
          </div>

          {/* Bottom CTA */}
          <div
            className="mt-16 rounded-2xl p-10 text-center"
            style={{ background: 'var(--canvas-parchment)' }}
          >
            <h3 className="font-semibold mb-3" style={{ fontSize: 26, color: 'var(--ink)' }}>
              Ready to publish your book?
            </h3>
            <p style={{ color: 'var(--ink-48)', fontSize: 17, marginBottom: 24 }}>
              Our team is here to guide you from manuscript to market.
            </p>
            <Link href="/contact" className="btn-primary" style={{ fontSize: 17, padding: '12px 28px' }}>
              Get in touch
            </Link>
          </div>
        </div>
      </article>

    </div>
  )
}
