import { useNavigate } from 'react-router-dom'
import { UserPlus, ClipboardPlus, Dumbbell, BarChart2 } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'
import { ROUTES } from '../../utils/constants'

export function QuickActions() {
  const navigate = useNavigate()
  const { t }    = useLanguage()

  const actions = [
    {
      label:       t('dashboard.addAthleteLabel'),
      description: t('dashboard.addAthleteDesc'),
      icon:        UserPlus,
      to:          ROUTES.ATHLETES,
      iconBg:      'bg-blue-50',
      iconColor:   'text-blue-600',
      hoverBg:     'hover:bg-blue-50',
    },
    {
      label:       t('dashboard.newProgramLabel'),
      description: t('dashboard.newProgramDesc'),
      icon:        ClipboardPlus,
      to:          ROUTES.TRAINING_PROGRAMS,
      iconBg:      'bg-purple-50',
      iconColor:   'text-purple-600',
      hoverBg:     'hover:bg-purple-50',
    },
    {
      label:       t('dashboard.addExerciseLabel'),
      description: t('dashboard.addExerciseDesc'),
      icon:        Dumbbell,
      to:          ROUTES.EXERCISES,
      iconBg:      'bg-emerald-50',
      iconColor:   'text-emerald-600',
      hoverBg:     'hover:bg-emerald-50',
    },
    {
      label:       t('dashboard.analyticsLabel'),
      description: t('dashboard.analyticsDesc'),
      icon:        BarChart2,
      to:          ROUTES.ANALYTICS,
      iconBg:      'bg-orange-50',
      iconColor:   'text-orange-600',
      hoverBg:     'hover:bg-orange-50',
    },
  ]

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">{t('dashboard.quickActions')}</h3>
        <p className="text-xs text-gray-400 mt-0.5">{t('dashboard.quickActionsSubtitle')}</p>
      </div>
      <div className="p-3 grid grid-cols-2 gap-2">
        {actions.map(({ label, description, icon: Icon, to, iconBg, iconColor, hoverBg }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            className={`flex flex-col items-start gap-2.5 rounded-lg p-3 text-left transition-colors border border-transparent hover:border-gray-200 ${hoverBg} cursor-pointer`}
          >
            <div className={`rounded-lg p-2 ${iconBg}`}>
              <Icon size={16} className={iconColor} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900 leading-tight">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-tight">{description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
