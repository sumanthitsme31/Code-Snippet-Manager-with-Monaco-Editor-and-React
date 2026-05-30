import { useState } from 'react'

const LANGUAGES = [
  'javascript','typescript','python','ruby','go','rust','cpp','c','csharp',
  'java','php','swift','kotlin','html','css','scss','json','yaml','shell',
  'markdown','sql','xml','plaintext'
]

export default function CreateSnippetModal({ onSave, onClose }) {
  const [title, setTitle] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [tags, setTags] = useState('')

  function handleSubmit() {
    onSave({ title, language, tags, content: '' })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">// new snippet</div>

        <div className="form-group">
          <label className="form-label">Title</label>
          <input
            data-testid="snippet-title-input"
            className="input"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="My awesome snippet"
            autoFocus
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Language</label>
          <select
            data-testid="snippet-language-input"
            className="input"
            value={language}
            onChange={e => setLanguage(e.target.value)}
          >
            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Tags (comma-separated)</label>
          <input
            data-testid="snippet-tags-input"
            className="input"
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="react, hook, utility"
          />
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 24 }}>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button
            data-testid="save-snippet-button"
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            Create Snippet
          </button>
        </div>
      </div>
    </div>
  )
}
