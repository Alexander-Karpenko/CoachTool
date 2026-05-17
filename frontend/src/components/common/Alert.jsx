import { X } from 'lucide-react'

const variants = {
  error:   'bg-red-50   border-red-400   text-red-700',
  success: 'bg-green-50 border-green-400 text-green-700',
  warning: 'bg-yellow-50 border-yellow-400 text-yellow-700',
  info:    'bg-blue-50  border-blue-400  text-blue-700',
}

export function Alert({ message, variant = 'error', onClose }) {
  if (!message) return null

  return (
    <div className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${variants[variant]}`}>
      <span className="flex-1">{message}</span>
      {onClose && (
        <button onClick={onClose} className="shrink-0 opacity-70 hover:opacity-100 transition-opacity">
          <X size={16} />
        </button>
      )}
    </div>
  )
}
