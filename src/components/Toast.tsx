export interface ToastData {
  id: string
  type: 'success' | 'error' | 'info'
  title: string
  message?: string
}

interface Props {
  toasts: ToastData[]
  onDismiss: (id: string) => void
}

const ICONS: Record<ToastData['type'], string> = {
  success: '✓',
  error:   '✕',
  info:    'ℹ',
}

export function Toast({ toasts, onDismiss }: Props) {
  if (toasts.length === 0) return null
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast toast-${t.type}`}
          onClick={() => onDismiss(t.id)}
          role="alert"
          style={{ cursor: 'pointer' }}
        >
          <div className="toast-icon">{ICONS[t.type]}</div>
          <div className="toast-body">
            <div className="toast-title">{t.title}</div>
            {t.message && <div className="toast-msg">{t.message}</div>}
          </div>
        </div>
      ))}
    </div>
  )
}
