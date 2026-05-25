import Link from 'next/link'
import { Calendar, Tag, ArrowRight } from 'lucide-react'
import AnimateIn from '@/components/ui/AnimateIn'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  coverImageUrl: string | null
  isPublished: boolean
  publishedAt: string | null
  tags: string[]
  author: { id: string; name: string; avatarUrl: string | null }
}

interface BlogResponse {
  posts: Post[]
  total: number
  page: number
  limit: number
  totalPages: number
}

async function getPosts(tag?: string, page = 1): Promise<BlogResponse> {
  const params = new URLSearchParams({ page: String(page), limit: '9' })
  if (tag) params.set('tag', tag)
  const res = await fetch(`${API}/blog?${params}`, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error('Failed to load posts')
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
      className="inline-flex items-center justify-center rounded-full font-semibold text-white shrink-0"
      style={{ width: 32, height: 32, fontSize: 12, background: 'var(--primary)' }}
    >
      {text.toUpperCase()}
    </span>
  )
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; page?: string }>
}) {
  const sp   = await searchParams
  const tag  = sp.tag
  const page = Number(sp.page ?? 1)
  const data = await getPosts(tag, page).catch(() => null)
  const { posts = [], totalPages = 0, total = 0 } = data ?? {}

  const POPULAR_TAGS = ['writing', 'publishing', 'tips', 'marketing', 'self-publishing', 'editing']

  return (
    <div style={{ background: 'var(--canvas)', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ background: 'var(--canvas-parchment)', paddingTop: 96, paddingBottom: 72 }}>
        <div className="container-apple text-center">
          <AnimateIn>
            <p className="font-semibold uppercase mb-4"
              style={{ color: 'var(--primary)', fontSize: 12, letterSpacing: '0.1em' }}>
              Smart Book Blog
            </p>
            <h1
              className="font-semibold mb-5"
              style={{
                fontFamily: "'SF Pro Display', system-ui, sans-serif",
                fontSize: 'clamp(40px, 6vw, 56px)',
                lineHeight: 1.07,
                letterSpacing: '-0.5px',
                color: 'var(--ink)',
              }}
            >
              Insights for authors.
            </h1>
            <p style={{ color: 'var(--ink-48)', fontSize: 19, lineHeight: 1.45, maxWidth: 520, margin: '0 auto 40px' }}>
              Publishing advice, writing tips, and industry news from the Smart Book team.
            </p>

            {/* Tag pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Link
                href="/blog"
                className="rounded-pill px-4 py-2 font-semibold transition-all duration-150"
                style={{
                  fontSize: 13,
                  background: !tag ? 'var(--primary)' : 'transparent',
                  color:      !tag ? '#fff' : 'var(--ink-48)',
                  border:     !tag ? '1px solid var(--primary)' : '1px solid var(--hairline)',
                }}
              >
                All posts
              </Link>
              {POPULAR_TAGS.map(t => (
                <Link
                  key={t}
                  href={`/blog?tag=${t}`}
                  className="rounded-pill px-4 py-2 font-semibold capitalize transition-all duration-150"
                  style={{
                    fontSize: 13,
                    background: tag === t ? 'var(--primary)' : 'transparent',
                    color:      tag === t ? '#fff' : 'var(--ink-48)',
                    border:     tag === t ? '1px solid var(--primary)' : '1px solid var(--hairline)',
                  }}
                >
                  {t}
                </Link>
              ))}
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Posts grid */}
      <section style={{ paddingTop: 80, paddingBottom: 100 }}>
        <div className="container-apple">

          {posts.length === 0 ? (
            <div className="text-center py-24">
              <p style={{ color: 'var(--ink-48)', fontSize: 19 }}>
                {tag ? `No posts tagged "${tag}" yet.` : 'No posts published yet. Check back soon.'}
              </p>
              {tag && (
                <Link href="/blog" className="btn-primary mt-6 inline-flex" style={{ fontSize: 15 }}>
                  View all posts
                </Link>
              )}
            </div>
          ) : (
            <>
              <p style={{ color: 'var(--ink-48)', fontSize: 14, marginBottom: 40 }}>
                {total} {total === 1 ? 'post' : 'posts'}{tag ? ` tagged "${tag}"` : ''}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, i) => (
                  <AnimateIn key={post.id} delay={i * 60}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group flex flex-col rounded-2xl overflow-hidden h-full transition-transform duration-200 hover:-translate-y-1"
                      style={{ border: '1px solid var(--hairline)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
                    >
                      {/* Cover image placeholder */}
                      <div
                        className="w-full flex items-center justify-center"
                        style={{
                          height: 180,
                          background: `linear-gradient(135deg, #e8f0fb 0%, #f0f4ff 100%)`,
                        }}
                      >
                        {post.coverImageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover" />
                        ) : (
                          <span style={{ fontSize: 40 }}>📖</span>
                        )}
                      </div>

                      {/* Body */}
                      <div className="flex flex-col flex-1 p-6">
                        {/* Tags */}
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.tags.slice(0, 3).map(t => (
                              <span
                                key={t}
                                className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 capitalize"
                                style={{ background: 'rgba(0,102,204,0.08)', color: 'var(--primary)', fontSize: 11, fontWeight: 600 }}
                              >
                                <Tag className="w-3 h-3" strokeWidth={2} />
                                {t}
                              </span>
                            ))}
                          </div>
                        )}

                        <h2
                          className="font-semibold mb-3 group-hover:text-primary transition-colors duration-150"
                          style={{ fontSize: 19, lineHeight: 1.3, color: 'var(--ink)' }}
                        >
                          {post.title}
                        </h2>

                        {post.excerpt && (
                          <p style={{ color: 'var(--ink-48)', fontSize: 15, lineHeight: 1.5, flex: 1 }}>
                            {post.excerpt}
                          </p>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-6 pt-4" style={{ borderTop: '1px solid var(--divider-soft)' }}>
                          <div className="flex items-center gap-2">
                            <Initials name={post.author.name} />
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-80)' }}>{post.author.name}</p>
                              {post.publishedAt && (
                                <p style={{ fontSize: 11, color: 'var(--ink-48)' }}>
                                  <Calendar className="inline w-3 h-3 mr-0.5" strokeWidth={1.8} />
                                  {formatDate(post.publishedAt)}
                                </p>
                              )}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-150" strokeWidth={2} />
                        </div>
                      </div>
                    </Link>
                  </AnimateIn>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-16">
                  {page > 1 && (
                    <Link
                      href={`/blog?${tag ? `tag=${tag}&` : ''}page=${page - 1}`}
                      className="btn-secondary"
                      style={{ fontSize: 15, padding: '10px 24px' }}
                    >
                      Previous
                    </Link>
                  )}
                  <span style={{ color: 'var(--ink-48)', fontSize: 14 }}>
                    Page {page} of {totalPages}
                  </span>
                  {page < totalPages && (
                    <Link
                      href={`/blog?${tag ? `tag=${tag}&` : ''}page=${page + 1}`}
                      className="btn-primary"
                      style={{ fontSize: 15, padding: '10px 24px' }}
                    >
                      Next
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
