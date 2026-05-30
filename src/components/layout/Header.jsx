import { useStore } from '../../store/useStore'

export default function Header({ onCreateSnippet }) {
  const theme = useStore(s => s.theme)
  const toggleTheme = useStore(s => s.toggleTheme)
  const exportBackup = useStore(s => s.exportBackup)
  const importBackup = useStore(s => s.importBackup)
  const showToast = useStore(s => s.showToast)
  const searchQuery = useStore(s => s.searchQuery)
  const setSearchQuery = useStore(s => s.setSearchQuery)

  const isDark = theme === 'vs-dark'

  function handleRestore(e) {
    const file = e.target.files[0]
    if (!file) return
    importBackup(file)
      .then(count => showToast(`Restored ${count} snippets`, 'success'))
      .catch(() => showToast('Failed to restore backup', 'error'))
    e.target.value = ''
  }

  return (
    <header className="header">
      <div className="logo">Snippet<span>Vault</span></div>

      <div className="divider" />

      <input
        data-testid="search-input"
        className="input"
        style={{ maxWidth: 280, flex: 1 }}
        placeholder="Search snippets..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />

      <div style={{ flex: 1 }} />

      {/* GitHub Gist import */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input
          data-testid="gist-import-input"
          className="input"
          style={{ width: 220 }}
          placeholder="https://gist.github.com/..."
          id="gist-import-url"
        />
        <button
          data-testid="gist-import-button"
          className="btn btn-sm"
          onClick={() => {
            const url = document.getElementById('gist-import-url')?.value?.trim()
            if (url) onCreateSnippet({ gistUrl: url })
          }}
        >
          ↓ Import Gist
        </button>
      </div>

      <div className="divider" />

      {/* Backup/Restore */}
      <button data-testid="backup-button" className="btn btn-sm" onClick={exportBackup} title="Export backup">
        ↑ Backup
      </button>
      <label className="btn btn-sm" title="Restore backup" style={{ cursor: 'pointer' }}>
        ↓ Restore
        <input
          data-testid="restore-input"
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={handleRestore}
        />
      </label>

      <div className="divider" />

      {/* Theme toggle */}
      <button
        data-testid="theme-toggle-button"
        className="btn btn-sm btn-icon"
        onClick={toggleTheme}
        title={isDark ? 'Switch to light' : 'Switch to dark'}
        style={{ fontSize: 14 }}
      >
        {isDark ? '☀️' : '🌙'}
      </button>

      {/* New snippet */}
      <button
        data-testid="create-snippet-button"
        className="btn btn-primary btn-sm"
        onClick={() => onCreateSnippet({})}
      >
        + New Snippet
      </button>
    </header>
  )
}
