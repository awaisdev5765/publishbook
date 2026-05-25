import Link from 'next/link'

export default function PostNotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center" style={{ minHeight: '60vh', padding: '80px 20px' }}>
      <p style={{ color: 'var(--primary)', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
        404
      </p>
      <h1 className="font-semibold mb-4" style={{ fontSize: 40, color: 'var(--ink)' }}>
        Post not found
      </h1>
      <p style={{ color: 'var(--ink-48)', fontSize: 19, marginBottom: 32 }}>
        This post may have been removed or the URL is incorrect.
      </p>
      <Link href="/blog" className="btn-primary" style={{ fontSize: 17 }}>
        Browse all posts
      </Link>
    </div>
  )
}
