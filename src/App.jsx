import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useStore } from './store/useStore'
import Dashboard from './pages/Dashboard'
import ViewSnippet from './pages/ViewSnippet'
import Toast from './components/Toast'

export default function App() {
  const theme = useStore(s => s.theme)

  useEffect(() => {
    // Apply theme class to body for CSS variable switching
    if (theme === 'vs') {
      document.body.classList.add('light')
    } else {
      document.body.classList.remove('light')
    }
  }, [theme])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/snippets/view/:snippetId" element={<ViewSnippet />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
      <Toast />
    </BrowserRouter>
  )
}
