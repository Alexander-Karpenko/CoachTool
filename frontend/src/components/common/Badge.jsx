const styles = {
  gray:   'bg-gray-100   text-gray-600',
  blue:   'bg-blue-100   text-blue-700',
  indigo: 'bg-indigo-100 text-indigo-700',
  purple: 'bg-purple-100 text-purple-700',
  green:  'bg-emerald-100 text-emerald-700',
  red:    'bg-red-100    text-red-600',
  orange: 'bg-orange-100 text-orange-700',
}

export function Badge({ label, variant = 'gray', className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[variant] ?? styles.gray} ${className}`}>
      {label}
    </span>
  )
}
