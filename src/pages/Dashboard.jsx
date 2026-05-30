import { useState } from 'react'
import Header from '../components/layout/Header'
import Sidebar from '../components/sidebar/Sidebar'
import EditorPanel from '../components/editor/EditorPanel'
import CreateSnippetModal from '../components/modals/CreateSnippetModal'
import { useStore } from '../store/useStore'
import { importGist } from '../services/github'
import { useDebounce } from '../hooks/useDebounce'

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false)
  const [pendingGistUrl, setPendingGistUrl] = useState(null)
  const createSnippet = useStore(s => s.createSnippet)
  const showToast = useStore(s => s.showToast)
  const searchQuery = useStore(s => s.searchQuery)
  const setSearchQuery = useStore(s => s.setSearchQuery)

  // Debounce search
  const debouncedSearch = useDebounce(searchQuery, 300)
  // We sync debounced back to store search for filtering
  // (store already has searchQuery, but filtering runs on getFilteredSnippets)

  function handleCreateRequest({ gistUrl } = {}) {
    if (gistUrl) {
      handleGistImport(gistUrl)
    } else {
      setShowModal(true)
    }
  }

  async function handleGistImport(url) {
    try {
      showToast('Importing Gist...', 'info')
      const data = await importGist(url)
      createSnippet(data)
      showToast(`Imported: ${data.title}`, 'success')
      // clear import field
      const input = document.getElementById('gist-import-url')
      if (input) input.value = ''
    } catch (err) {
      showToast(`Import failed: ${err.message}`, 'error')
    }
  }

  function handleModalSave(data) {
    createSnippet(data)
  }

  return (
    <>
      <div className="app-shell">
        <Header onCreateSnippet={handleCreateRequest} />
        <Sidebar />
        <EditorPanel />
      </div>

      {showModal && (
        <CreateSnippetModal
          onSave={handleModalSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
