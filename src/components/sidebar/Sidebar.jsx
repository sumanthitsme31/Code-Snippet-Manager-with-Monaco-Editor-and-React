import { useStore } from '../../store/useStore'

const LANGUAGE_COLORS = {
  javascript: '#f0c46a',
  typescript: '#6ab0f0',
  python: '#4af0b0',
  ruby: '#f06a6a',
  go: '#6af0f0',
  rust: '#f09a6a',
  html: '#f06a6a',
  css: '#6a6af0',
  json: '#aaf06a',
  sql: '#f06af0',
  shell: '#aaaaaa',
  default: '#888899',
}

function LangBadge({ lang }) {
  const color = LANGUAGE_COLORS[lang?.toLowerCase()] || LANGUAGE_COLORS.default
  return (
    <span className="lang-badge" style={{ color, borderColor: color + '44' }}>
      {lang || 'txt'}
    </span>
  )
}

export default function Sidebar() {
  const selectedId = useStore(s => s.selectedId)
  const setSelectedId = useStore(s => s.setSelectedId)
  const deleteSnippet = useStore(s => s.deleteSnippet)
  const activeTag = useStore(s => s.activeTag)
  const setActiveTag = useStore(s => s.setActiveTag)
  const getFilteredSnippets = useStore(s => s.getFilteredSnippets)
  const snippets = useStore(s => s.snippets) // subscribe to changes

  const filtered = getFilteredSnippets()

  // Collect all unique tags
  const allTags = [...new Set(snippets.flatMap(s => s.tags))]

  return (
    <aside className="sidebar">
      {/* Tag filters */}
      {allTags.length > 0 && (
        <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {activeTag && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setActiveTag(null)}
              style={{ fontSize: 10, padding: '2px 6px' }}
            >
              ✕ clear
            </button>
          )}
          {allTags.map(tag => (
            <span
              key={tag}
              data-testid="snippet-tag"
              className={`tag ${activeTag === tag ? 'active' : ''}`}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Snippet list */}
      <div data-testid="snippet-list" style={{ flex: 1, overflowY: 'auto' }}>
        {filtered.length === 0 ? (
          <div className="empty-state" style={{ padding: 24 }}>
            <div className="icon">📭</div>
            <div className="title">No snippets found</div>
            <div className="subtitle">Create one with the + button</div>
          </div>
        ) : (
          filtered.map(snippet => (
            <div
              key={snippet.id}
              data-testid="snippet-item"
              className={`snippet-item ${selectedId === snippet.id ? 'active' : ''}`}
              onClick={() => setSelectedId(snippet.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <div className="title">{snippet.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, marginLeft: 8 }}>
                  <LangBadge lang={snippet.language} />
                  <button
                    data-testid="delete-snippet-button"
                    className="btn btn-ghost btn-danger btn-icon"
                    style={{ fontSize: 11, padding: '2px 4px', opacity: 0 }}
                    onMouseOver={e => e.currentTarget.style.opacity = 1}
                    onMouseOut={e => e.currentTarget.style.opacity = 0}
                    onClick={e => {
                      e.stopPropagation()
                      deleteSnippet(snippet.id)
                    }}
                    title="Delete snippet"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {snippet.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 4 }}>
                  {snippet.tags.map(tag => (
                    <span
                      key={tag}
                      data-testid="snippet-tag"
                      className={`tag ${activeTag === tag ? 'active' : ''}`}
                      style={{ fontSize: 9 }}
                      onClick={e => { e.stopPropagation(); setActiveTag(activeTag === tag ? null : tag) }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer count */}
      <div style={{ padding: '6px 12px', borderTop: '1px solid var(--border)', fontSize: 10, color: 'var(--text-dim)' }}>
        {filtered.length} / {snippets.length} snippets
      </div>
    </aside>
  )
}
