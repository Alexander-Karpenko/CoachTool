import { AlertTriangle } from 'lucide-react'
import { Modal }  from './Modal'
import { Button } from './Button'

export function ConfirmDialog({ open, onClose, onConfirm, title, message, loading }) {
  return (
    <Modal open={open} onClose={onClose} title="Confirm" size="sm">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="rounded-full bg-red-100 p-3">
          <AlertTriangle size={22} className="text-red-600" />
        </div>
        <div>
          <p className="font-semibold text-gray-900">{title}</p>
          <p className="text-sm text-gray-500 mt-1">{message}</p>
        </div>
        <div className="flex gap-3 w-full">
          <Button variant="secondary" fullWidth onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="danger"    fullWidth onClick={onConfirm} loading={loading}>Delete</Button>
        </div>
      </div>
    </Modal>
  )
}
