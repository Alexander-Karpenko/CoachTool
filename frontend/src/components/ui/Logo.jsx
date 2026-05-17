import { Dumbbell } from 'lucide-react'

export function Logo({ size = 'md', dark = false }) {
  const sizes = { sm: { icon: 18, text: 'text-lg' }, md: { icon: 24, text: 'text-xl' }, lg: { icon: 32, text: 'text-2xl' } }
  const { icon, text } = sizes[size]

  return (
    <div className="flex items-center gap-2">
      <div className="rounded-lg bg-indigo-600 p-1.5">
        <Dumbbell size={icon} className="text-white" />
      </div>
      <span className={`font-bold ${text} ${dark ? 'text-white' : 'text-gray-900'}`}>
        CoachTool
      </span>
    </div>
  )
}
