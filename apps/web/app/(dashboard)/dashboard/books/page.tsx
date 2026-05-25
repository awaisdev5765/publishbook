'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, ChevronUp, Loader2, X } from 'lucide-react'
import api from '@/lib/api'

interface Book {
  id: string; title: string; genre: string; status: string
  synopsis: string | null; manuscriptUrl: string | null; coverUrl: string | null
  createdAt: string; updatedAt: string
}

const STATUS_TRANSITIONS: Record<string, string[]> = {
  DRAFT:     ['IN_REVIEW'],
  IN_REVIEW: ['DRAFT', 'PUBLISHED'],
  PUBLISHED: ['DRAFT'],
}
const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  DRAFT:     { bg: 'rgba(142,142,147,0.12)', text: '#8e8e93' },
  IN_REVIEW: { bg: 'rgba(255,149,0,0.12)',   text: '#ff9f0a' },
  PUBLISHED: { bg: 'rgba(52,199,89,0.12)',   text: '#34c759' },
}

function Badge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] ?? STATUS_COLORS.DRAFT
  return (
    <span className="inline-block px-2.5 py-0.5 rounded-full font-semibold capitalize"
      style={{ fontSize: 11, background: c.bg, color: c.text }}>
      {status.toLowerCase().replace('_', ' ')}
    </span>
  )
}

interface FormState { title: string; genre: string; synopsis: string }
const EMPTY: FormState = { title: '', genre: '', synopsis: '' }

export default function BooksPage() {
  const [books,   setBooks]   = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing,  setEditing]  = useState<Book | null>(null)
  const [form,     setForm]     = useState<FormState>(EMPTY)
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState('')

  const load = () => {
    setLoading(true)
    api.get<Book[]>('/books/mine')
      .then(r => setBooks(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  function openCreate() { setEditing(null); setForm(EMPTY); setShowForm(true); setError('') }
  function openEdit(b: Book) {
    setEditing(b)
    setForm({ title: b.title, genre: b.genre, synopsis: b.synopsis ?? '' })
    setShowForm(true)
    setError('')
  }
  function closeForm() { setShowForm(false); setEditing(null); setForm(EMPTY) }

  async function saveBook() {
    if (!form.title.trim() || !form.genre.trim()) { setError('Title and genre are required.'); return }
    setSaving(true); setError('')
    try {
      if (editing) {
        await api.patch(`/books/${editing.id}`, form)
      } else {
        await api.post('/books', form)
      }
      closeForm(); load()
    } catch {
      setError('Failed to save. Please try again.')
    } finally { setSaving(false) }
  }

  async function deleteBook(id: string) {
    if (!confirm('Delete this book? This cannot be undone.')) return
    await api.delete(`/books/${id}`).catch(() => {})
    load()
  }

  async function changeStatus(id: string, status: string) {
    await api.patch(`/books/${id}/status`, { status }).catch(() => {})
    load()
  }

  return (
    <div className="max-w-4xl mx-auto">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-semibold" style={{ fontSize: 26, color: 'var(--ink)' }}>My Books</h1>
          <p style={{ color: 'var(--ink-48)', fontSize: 14, marginTop: 2 }}>Manage your manuscripts and publishing progress.</p>
        </div>
        <button onClick={openCreate} className="btn-primary" style={{ fontSize: 14, padding: '10px 18px' }}>
          <Plus className="w-4 h-4" /> Add Book
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="w-full max-w-lg rounded-2xl bg-canvas p-8" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold" style={{ fontSize: 20, color: 'var(--ink)' }}>
                {editing ? 'Edit book' : 'Add a new book'}
              </h2>
              <button onClick={closeForm} className="text-ink-48 hover:text-ink">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block mb-1.5 font-medium" style={{ fontSize: 13, color: 'var(--ink-80)' }}>
                  Title <span className="text-primary">*</span>
                </label>
                <input className="input-field" placeholder="The Great Novel" value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div>
                <label className="block mb-1.5 font-medium" style={{ fontSize: 13, color: 'var(--ink-80)' }}>
                  Genre <span className="text-primary">*</span>
                </label>
                <input className="input-field" placeholder="Literary Fiction" value={form.genre}
                  onChange={e => setForm(f => ({ ...f, genre: e.target.value }))} />
              </div>
              <div>
                <label className="block mb-1.5 font-medium" style={{ fontSize: 13, color: 'var(--ink-80)' }}>Synopsis</label>
                <textarea rows={4} className="input-field" placeholder="A brief description of your book…"
                  value={form.synopsis} style={{ resize: 'vertical' }}
                  onChange={e => setForm(f => ({ ...f, synopsis: e.target.value }))} />
              </div>
              {error && <p style={{ color: '#ff3b30', fontSize: 13 }}>{error}</p>}
              <div className="flex gap-3 pt-2">
                <button onClick={closeForm} className="btn-secondary flex-1" style={{ fontSize: 14 }}>Cancel</button>
                <button onClick={saveBook} disabled={saving} className="btn-primary flex-1" style={{ fontSize: 14 }}>
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : 'Save book'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Books list */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-7 h-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : books.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 rounded-2xl bg-canvas text-center"
          style={{ border: '1px solid var(--hairline)' }}>
          <p style={{ color: 'var(--ink-48)', fontSize: 16 }}>No books yet.</p>
          <button onClick={openCreate} className="text-primary hover:underline mt-2" style={{ fontSize: 14 }}>
            Add your first book →
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {books.map(book => {
            const transitions = STATUS_TRANSITIONS[book.status] ?? []
            return (
              <div key={book.id} className="rounded-2xl bg-canvas p-6"
                style={{ border: '1px solid var(--hairline)', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <h3 className="font-semibold truncate" style={{ fontSize: 17, color: 'var(--ink)' }}>{book.title}</h3>
                      <Badge status={book.status} />
                    </div>
                    <p style={{ color: 'var(--ink-48)', fontSize: 13 }}>{book.genre}</p>
                    {book.synopsis && (
                      <p className="mt-2 line-clamp-2" style={{ color: 'var(--ink-80)', fontSize: 14, lineHeight: 1.5 }}>
                        {book.synopsis}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {transitions.map(next => (
                      <button key={next} onClick={() => changeStatus(book.id, next)}
                        className="flex items-center gap-1 rounded-lg px-3 py-1.5 font-medium transition-colors hover:bg-canvas-parchment"
                        style={{ fontSize: 12, color: 'var(--primary)', border: '1px solid var(--hairline)' }}>
                        <ChevronUp className="w-3 h-3" />
                        {next.replace('_', ' ').toLowerCase()}
                      </button>
                    ))}
                    <button onClick={() => openEdit(book)}
                      className="flex items-center justify-center rounded-lg transition-colors hover:bg-canvas-parchment"
                      style={{ width: 34, height: 34, border: '1px solid var(--hairline)', color: 'var(--ink-48)' }}>
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deleteBook(book.id)}
                      className="flex items-center justify-center rounded-lg transition-colors hover:bg-red-50"
                      style={{ width: 34, height: 34, border: '1px solid var(--hairline)', color: '#ff3b30' }}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
