import { TrendingUp, TrendingDown, Users, Dumbbell, ClipboardList, Calendar } from 'lucide-react'
import { Skeleton }    from '../common/Skeleton'
import { useLanguage } from '../../hooks/useLanguage'

const iconMap = {
  users:     { Icon: Users,         bg: 'bg-blue-50',   text: 'text-blue-600'   },
  dumbbell:  { Icon: Dumbbell,      bg: 'bg-green-50',  text: 'text-green-600'  },
  clipboard: { Icon: ClipboardList, bg: 'bg-purple-50', text: 'text-purple-600' },
  calendar:  { Icon: Calendar,      bg: 'bg-orange-50', text: 'text-orange-600' },
}

export function StatsCard({ label, value, change, changeType, icon, loading }) {
  const { t } = useLanguage()

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
        <Skeleton className="h-9 w-16 mb-2" />
        <Skeleton className="h-3 w-36" />
      </div>
    )
  }

  const { Icon, bg, text } = iconMap[icon] ?? iconMap.users
  const isIncrease  = changeType === 'increase'
  const changeColor = isIncrease ? 'text-emerald-600' : 'text-red-500'
  const TrendIcon   = isIncrease ? TrendingUp : TrendingDown

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <div className={`rounded-lg p-2.5 ${bg}`}>
          <Icon size={18} className={text} />
        </div>
      </div>
      <p className="mt-3 text-3xl font-bold text-gray-900">{value ?? 0}</p>
      {change != null && (
        <div className={`mt-1.5 flex items-center gap-1 text-xs font-medium ${changeColor}`}>
          <TrendIcon size={12} />
          <span>
            {change} {isIncrease ? t('dashboard.more') : t('dashboard.less')} {t('dashboard.thanLastPeriod')}
          </span>
        </div>
      )}
    </div>
  )
}
