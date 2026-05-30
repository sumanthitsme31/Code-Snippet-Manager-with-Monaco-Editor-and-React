import { lazy, Suspense, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { exportGist } from '../../services/github'

const MonacoEditor = lazy(() => import('@monaco-editor/react'))

const LANGUAGES = [
  'javascript','typescript','python','ruby','go','rust','cpp','c','csharp',
  'java','php','swift','kotlin','html','css','scss','json','yaml','shell',
  'markdown','sql','xml','plaintext'
]

export default function EditorPanel() {
  const selectedId = useStore(s => s.selectedId)
  const getSelectedSnippet = useStore(s => s.getSelectedSnippet)
  const updateSnippet = useStore(s => s.updateSnippet)
  const theme = useStore(s => s.theme)
  const showToast = useStore(s => s.showToast)
  const snippets = useStore(s => s.snippets) // trigger rerender on changes

  const snippet = getSelectedSnippet()
  const editorRef = useRef(null)
  const [exporting, setExporting] = useState(false)
  const navigate = useNavigate()

  if (!snippet) {
    return (
      <div className="main-content">
        <div className="no-snippet">
          <div className="big-icon">{'</>'}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Select or create a snippet</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>Use the + button to get started</div>
        </div>
      </div>
    )
  }

  function handleEditorMount(editor) {
    editorRef.current = editor
  }

  function handleContentChange(value) {
    updateSnippet(snippet.id, { content: value || '' })
  }

  function handleTitleChange(e) {
    updateSnippet(snippet.id, { title: e.target.value })
  }

  function handleLangChange(e) {
    updateSnippet(snippet.id, { language: e.target.value })
  }

  function handleTagsChange(e) {
    updateSnippet(snippet.id, { tags: e.target.value })
  }

  async function handleCopy() {
    const content = editorRef.current?.getValue() ?? snippet.content
    try {
      await navigator.clipboard.writeText(content)
      showToast('Copied to clipboard!', 'success')
    } catch {
      showToast('Copy failed', 'error')
    }
  }

  async function handleExportGist() {
    setExporting(true)
    try {
      const url = await exportGist(snippet)
      showToast(`Gist created! ${url}`, 'success')
    } catch (err) {
      showToast(`Export failed: ${err.message}`, 'error')
    } finally {
      setExporting(false)
    }
  }

  function handleShare() {
    const shareUrl = `${window.location.origin}/snippets/view/${snippet.id}`
    navigator.clipboard.writeText(shareUrl).then(() => showToast('Share link copied!', 'success'))
  }

  const tagsString = Array.isArray(snippet.tags) ? snippet.tags.join(', ') : snippet.tags

  return (
    <div className="main-content">
      {/* Toolbar */}
      <div className="toolbar">
        <input
          className="input"
          style={{ flex: 1, maxWidth: 300 }}
          value={snippet.title}
          onChange={handleTitleChange}
          placeholder="Snippet title"
        />
        <select className="input" style={{ width: 140 }} value={snippet.language} onChange={handleLangChange}>
          {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <input
          className="input"
          style={{ flex: 1, maxWidth: 240 }}
          value={tagsString}
          onChange={handleTagsChange}
          placeholder="tags, comma-separated"
        />

        <div className="divider" />

        <button
          data-testid="copy-snippet-button"
          className="btn btn-sm"
          onClick={handleCopy}
          title="Copy code"
        >
          ⧉ Copy
        </button>

        <button
          className="btn btn-sm"
          onClick={handleShare}
          title="Copy shareable link"
        >
          🔗 Share
        </button>

        <button
          data-testid="gist-export-button"
          className="btn btn-sm"
          onClick={handleExportGist}
          disabled={exporting}
          title="Export as GitHub Gist"
        >
          {exporting ? '...' : '↑ Gist'}
        </button>
      </div>

      {/* Editor */}
      <div className="editor-wrapper" data-testid="monaco-editor-container">
        <Suspense fallback={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-dim)' }}>
            Loading editor...
          </div>
        }>
          <MonacoEditor
            height="100%"
            language={snippet.language || 'javascript'}
            value={snippet.content}
            theme={theme}
            onChange={handleContentChange}
            onMount={handleEditorMount}
            options={{
              fontSize: 13,
              fontFamily: '"JetBrains Mono", monospace',
              fontLigatures: true,
              minimap: { enabled: false },
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              tabSize: 2,
              automaticLayout: true,
              padding: { top: 12, bottom: 12 },
            }}
          />
        </Suspense>
      </div>
    </div>
  )
}
