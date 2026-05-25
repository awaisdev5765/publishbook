'use client'

import { useState, useEffect } from 'react'
import { Plus, Globe, EyeOff, Trash2, Loader2, X, Tag } from 'lucide-react'
import api from '@/lib/api'

interface Post {
  id: string; title: string; slug: string; excerpt: string | null
  isPublished: boolean; publishedAt: string | null; tags: string[]
  createdAt: string; author: { name: string }
}

interface FormState {
  title: string; content: string; excerpt: string; tags: string; isPublished: boolean
}
const EMPTY: FormState = { title: '', content: '', excerpt: '', tags: '', isPublished: true }

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function AdminBlogPage() {
  const [posts,    setPosts]    = useState<Post[]>([])
  const [loading,  setLoading]  = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form,     setForm]     = useState<FormState>(EMPTY)
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState('')
  const [toggling, setToggling] = useState<string | null>(null)

  const load = () =>
    api.get<Post[]>('/blog/admin')
      .then(r => setPosts(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  function openCreate() { setForm(EMPTY); setShowForm(true); setError('') }

  async function save() {
    if (!form.title.trim() || !form.content.trim()) { setError('Title and content are required.'); return }
    setSaving(true); setError('')
    try {
      const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean)
      await api.post('/blog', {
        title:       form.title,
        content:     form.content,
        excerpt:     form.excerpt || undefined,
        tags,
        isPublished: form.isPublished,
      })
      setShowForm(false); setForm(EMPTY); load()
    } catch {
      setError('Failed to save. Please try again.')
    } finally { setSaving(false) }
  }

  async function togglePublish(id: string) {
    setToggling(id)
    await api.patch(`/blog/${id}/publish`).catch(() => {})
    await load()
    setToggling(null)
  }

  async function deletePost(id: string) {
    if (!confirm('Delete this post? This cannot be undone.')) return
    await api.delete(`/blog/${id}`).catch(() => {})
    load()
  }

  const published = posts.filter(p => p.isPublished).length
  const drafts    = posts.filter(p => !p.isPublished).length

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-semibold" style={{ fontSize: 26, color: 'var(--ink)' }}>Blog Posts</h1>
          <p style={{ color: 'var(--ink-48)', fontSize: 14, marginTop: 2 }}>
            {published} published · {drafts} draft{drafts !== 1 ? 's' : ''}
          </p>
          <p style={{ color: 'var(--ink-48)', fontSize: 12, marginTop: 6 }}>
            Public blog only shows published posts.
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary" style={{ fontSize: 14, padding: '10px 18px' }}>
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      {/* Create form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-black/40 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-canvas p-8 mb-8" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold" style={{ fontSize: 20, color: 'var(--ink)' }}>New Blog Post</h2>
              <button onClick={() => setShowForm(false)} className="text-ink-48 hover:text-ink">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block mb-1.5 font-medium" style={{ fontSize: 13, color: 'var(--ink-80)' }}>
                  Title <span className="text-primary">*</span>
                </label>
                <input className="input-field" placeholder="Your post title"
                  value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div>
                <label className="block mb-1.5 font-medium" style={{ fontSize: 13, color: 'var(--ink-80)' }}>
                  Excerpt <span style={{ color: 'var(--ink-48)' }}>(optional)</span>
                </label>
                <input className="input-field" placeholder="A short summary shown in listings"
                  value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} />
              </div>
              <div>
                <label className="block mb-1.5 font-medium" style={{ fontSize: 13, color: 'var(--ink-80)' }}>
                  Content <span className="text-primary">*</span>
                </label>
                <textarea rows={10} className="input-field" placeholder="Write your post content here…"
                  value={form.content} style={{ resize: 'vertical', minHeight: 200, fontFamily: 'monospace', fontSize: 14 }}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />
              </div>
              <div>
                <label className="block mb-1.5 font-medium" style={{ fontSize: 13, color: 'var(--ink-80)' }}>
                  Tags <span style={{ color: 'var(--ink-48)' }}>(comma separated)</span>
                </label>
                <input className="input-field" placeholder="writing, tips, publishing"
                  value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
              </div>
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input type="checkbox" checked={form.isPublished}
                  onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))}
                  className="w-4 h-4 rounded accent-primary" />
                <span style={{ fontSize: 14, color: 'var(--ink)' }}>Publish immediately</span>
              </label>
              {error && <p style={{ color: '#ff3b30', fontSize: 13 }}>{error}</p>}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="btn-secondary flex-1" style={{ fontSize: 14 }}>
                  Cancel
                </button>
                <button onClick={save} disabled={saving} className="btn-primary flex-1" style={{ fontSize: 14 }}>
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : 'Save post'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Posts list */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-7 h-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 rounded-2xl bg-canvas text-center"
          style={{ border: '1px solid var(--hairline)' }}>
          <p style={{ color: 'var(--ink-48)', fontSize: 16 }}>No posts yet.</p>
          <button onClick={openCreate} className="text-primary hover:underline mt-2" style={{ fontSize: 14 }}>
            Write your first post →
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map(post => (
            <div key={post.id} className="flex items-center gap-4 rounded-2xl bg-canvas px-6 py-4"
              style={{ border: '1px solid var(--hairline)', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
              {/* Status dot */}
              <div className="shrink-0 w-2 h-2 rounded-full"
                style={{ background: post.isPublished ? '#34c759' : '#8e8e93' }} />

              <div className="flex-1 min-w-0">
                <p className="font-medium truncate" style={{ fontSize: 15, color: 'var(--ink)' }}>{post.title}</p>
                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                  <p style={{ fontSize: 12, color: 'var(--ink-48)' }}>
                    {post.author.name} · {formatDate(post.createdAt)}
                  </p>
                  {post.tags.slice(0, 3).map(t => (
                    <span key={t} className="inline-flex items-center gap-1"
                      style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 600 }}>
                      <Tag className="w-2.5 h-2.5" /> {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="font-semibold"
                  style={{ fontSize: 11, color: post.isPublished ? '#34c759' : '#8e8e93' }}>
                  {post.isPublished ? 'Published' : 'Draft'}
                </span>
                <button
                  onClick={() => togglePublish(post.id)}
                  disabled={toggling === post.id}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors hover:bg-canvas-parchment"
                  style={{ fontSize: 12, border: '1px solid var(--hairline)', color: 'var(--ink-48)' }}
                  title={post.isPublished ? 'Unpublish' : 'Publish'}
                >
                  {toggling === post.id
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : post.isPublished
                      ? <><EyeOff className="w-3.5 h-3.5" /> Unpublish</>
                      : <><Globe   className="w-3.5 h-3.5" /> Publish</>
                  }
                </button>
                <button onClick={() => deletePost(post.id)}
                  className="flex items-center justify-center rounded-lg transition-colors hover:bg-red-50"
                  style={{ width: 34, height: 34, border: '1px solid var(--hairline)', color: '#ff3b30' }}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
