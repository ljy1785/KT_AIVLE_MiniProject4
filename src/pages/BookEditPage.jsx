import { useState, useEffect } from 'react'
import '../styles/BookCreatePage.css'  // 등록 페이지와 스타일 공유
import '../styles/BookEditPage.css'
import '../styles/BookDetailPage.css'  // back-button 스타일 재사용

function BookEditPage({ bookId, navigate }) {
  const [form, setForm] = useState({ title: '', author: '', content: '' })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`http://localhost:3000/books/${bookId}`)
        if (!res.ok) throw new Error('책 정보를 불러오지 못했습니다')
        const data = await res.json()
        setForm({ title: data.title, author: data.author, content: data.content })
      } catch (err) {
        alert(err.message)
        navigate('list')
      } finally {
        setLoading(false)
      }
    }
    fetchBook()
  }, [bookId])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!form.title.trim()) { alert('제목을 입력해주세요!'); return }
    if (!form.author.trim()) { alert('저자를 입력해주세요!'); return }
    if (!form.content.trim()) { alert('내용을 입력해주세요!'); return }

    setSaving(true)
    try {
      const res = await fetch(`http://localhost:3000/books/${bookId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, updatedAt: new Date().toISOString() })
      })
      if (!res.ok) throw new Error('수정에 실패했습니다')
      alert('수정되었습니다!')
      navigate('detail', bookId)
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="form-container">불러오는 중...</div>

  return (
    <main className="form-container">
      <button className="back-button" onClick={() => navigate('detail', bookId)}>
        ← 상세로
      </button>

      <h2 className="edit-form-title">도서 수정</h2>

      <div className="form-group">
        <label>제목 *</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>저자 *</label>
        <input
          type="text"
          name="author"
          value={form.author}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>내용 *</label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          rows={6}
        />
      </div>

      <div className="form-buttons">
        <button className="cancel-button" onClick={() => navigate('detail', bookId)}>
          취소
        </button>
        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? '수정 중...' : '수정 완료'}
        </button>
      </div>
    </main>
  )
}

export default BookEditPage