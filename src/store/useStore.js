import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'code_snippets_data'
const THEME_KEY = 'snippet_vault_theme'

function loadSnippets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveSnippets(snippets) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets))
}

function loadTheme() {
  return localStorage.getItem(THEME_KEY) || 'vs-dark'
}

export const useStore = create((set, get) => ({
  snippets: loadSnippets(),
  selectedId: null,
  searchQuery: '',
  activeTag: null,
  theme: loadTheme(),
  toast: null,

  // CRUD
  createSnippet: (data) => {
    const snippet = {
      id: uuidv4(),
      title: data.title || 'Untitled',
      content: data.content || '',
      language: data.language || 'javascript',
      tags: Array.isArray(data.tags) ? data.tags : (data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : []),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const snippets = [snippet, ...get().snippets]
    saveSnippets(snippets)
    set({ snippets, selectedId: snippet.id })
    return snippet
  },

  updateSnippet: (id, data) => {
    const snippets = get().snippets.map(s =>
      s.id === id
        ? { ...s, ...data, tags: Array.isArray(data.tags) ? data.tags : (data.tags !== undefined ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : s.tags), updatedAt: new Date().toISOString() }
        : s
    )
    saveSnippets(snippets)
    set({ snippets })
  },

  deleteSnippet: (id) => {
    const snippets = get().snippets.filter(s => s.id !== id)
    saveSnippets(snippets)
    const selectedId = get().selectedId === id ? (snippets[0]?.id || null) : get().selectedId
    set({ snippets, selectedId })
  },

  setSelectedId: (id) => set({ selectedId: id }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setActiveTag: (tag) => set({ activeTag: tag }),

  toggleTheme: () => {
    const next = get().theme === 'vs-dark' ? 'vs' : 'vs-dark'
    localStorage.setItem(THEME_KEY, next)
    set({ theme: next })
  },

  showToast: (message, type = 'info') => {
    set({ toast: { message, type, id: Date.now() } })
    setTimeout(() => set({ toast: null }), 3000)
  },

  // Backup/Restore
  exportBackup: () => {
    const data = JSON.stringify(get().snippets, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `snippetvault-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  },

  importBackup: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const snippets = JSON.parse(e.target.result)
          if (!Array.isArray(snippets)) throw new Error('Invalid format')
          saveSnippets(snippets)
          set({ snippets, selectedId: snippets[0]?.id || null })
          resolve(snippets.length)
        } catch (err) { reject(err) }
      }
      reader.onerror = reject
      reader.readAsText(file)
    })
  },

  // Computed: filtered snippets
  getFilteredSnippets: () => {
    const { snippets, searchQuery, activeTag } = get()
    let result = snippets
    if (activeTag) {
      result = result.filter(s => s.tags.includes(activeTag))
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(s =>
        s.title.toLowerCase().includes(q) || s.content.toLowerCase().includes(q)
      )
    }
    return result
  },

  getSelectedSnippet: () => {
    const { snippets, selectedId } = get()
    return snippets.find(s => s.id === selectedId) || null
  },
}))
