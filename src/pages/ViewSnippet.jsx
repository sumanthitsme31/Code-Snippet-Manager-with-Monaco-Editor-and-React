import { lazy, Suspense } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useStore } from '../store/useStore'

const MonacoEditor = lazy(() => import('@monaco-editor/react'))

export default function ViewSnippet() {
  const { snippetId } = useParams()
  const snippets = useStore(s => s.snippets)
  const theme = useStore(s => s.theme)

  const snippet = snippets.find(s => s.id === snippetId)

  if (!snippet) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        background: 'var(--bg-primary)',
        color: 'var(--text-secondary)',
        fontFamily: '"JetBrains Mono", monospace',
      }}>
        <div style={{ fontSize: 48, opacity: 0.2 }}>404</div>
        <div data-testid="not-found-message" style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          Snippet not found
        </div>
        <Link to="/" style={{ color: 'var(--accent)', fontSize: 12 }}>← Back to SnippetVault</Link>
      </div>
    )
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{
        padding: '12px 20px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <Link to="/" style={{ color: 'var(--accent)', fontSize: 12, fontFamily: '"Space Mono", monospace', fontWeight: 700 }}>
          SnippetVault
        </Link>
        <span style={{ color: 'var(--border)', fontSize: 12 }}>/</span>
        <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>{snippet.title}</span>
        <span style={{
          fontSize: 10, padding: '1px 6px', borderRadius: 3,
          background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
          color: 'var(--text-secondary)', textTransform: 'uppercase'
        }}>
          {snippet.language}
        </span>
        <div style={{ flex: 1 }} />
        <div className="readonly-badge">Read Only</div>
      </div>

      {/* Tags */}
      {snippet.tags?.length > 0 && (
        <div style={{ padding: '8px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 6 }}>
          {snippet.tags.map(t => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      )}

      {/* Editor (read-only) */}
      <div style={{ flex: 1, position: 'relative' }} data-testid="monaco-editor-container">
        <Suspense fallback={<div style={{ padding: 20, color: 'var(--text-dim)' }}>Loading...</div>}>
          <MonacoEditor
            height="100%"
            language={snippet.language || 'javascript'}
            value={snippet.content}
            theme={theme}
            options={{
              readOnly: true,
              fontSize: 13,
              fontFamily: '"JetBrains Mono", monospace',
              minimap: { enabled: false },
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              automaticLayout: true,
              padding: { top: 16 },
              domReadOnly: true,
            }}
          />
        </Suspense>
      </div>
    </div>
  )
}
