import { useState } from 'react'
import '../styles/BookCreatePage.css'

function BookCreatePage({ navigate }) {
  const [form, setForm] = useState({ title: '', author: '', content: '' })
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!form.title.trim()) { alert('제목을 입력해주세요!'); return }
    if (!form.author.trim()) { alert('저자를 입력해주세요!'); return }
    if (!form.content.trim()) { alert('내용을 입력해주세요!'); return }

    setSaving(true)
    try {
      const res = await fetch('http://localhost:3000/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          coverImageUrl: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      })
      if (!res.ok) throw new Error('등록에 실패했습니다')
      alert('등록되었습니다!')
      navigate('list')
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="form-container">
      <button className="back-button" onClick={() => navigate('list')}>
        ← 목록으로
      </button>

      <h2 className="form-title">새 도서 등록</h2>

      <div className="form-group">
        <label>제목 *</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="도서 제목을 입력하세요"
        />
      </div>

      <div className="form-group">
        <label>저자 *</label>
        <input
          type="text"
          name="author"
          value={form.author}
          onChange={handleChange}
          placeholder="저자명을 입력하세요"
        />
      </div>

      <div className="form-group">
        <label>내용 *</label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="도서 내용을 입력하세요 (AI가 이 내용으로 표지를 만들어요!)"
          rows={6}
        />
      </div>

      <div className="form-buttons">
        <button className="cancel-button" onClick={() => navigate('list')}>
          취소
        </button>
        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? '저장 중...' : '저장'}
        </button>
      </div>
    </main>
  )
}

export default BookCreatePage