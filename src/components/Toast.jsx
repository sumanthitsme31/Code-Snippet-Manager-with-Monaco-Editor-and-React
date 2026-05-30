import { useStore } from '../store/useStore'

export default function Toast() {
  const toast = useStore(s => s.toast)
  if (!toast) return null

  const icons = { success: '✓', error: '✗', info: 'ℹ' }

  return (
    <div className={`toast ${toast.type}`} key={toast.id}>
      <span style={{ color: toast.type === 'success' ? 'var(--green)' : toast.type === 'error' ? 'var(--red)' : 'var(--accent)' }}>
        {icons[toast.type] || icons.info}
      </span>
      {toast.message}
    </div>
  )
}
