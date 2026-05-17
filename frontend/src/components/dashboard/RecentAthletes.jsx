import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { Skeleton }    from '../common/Skeleton'
import { useLanguage } from '../../hooks/useLanguage'
import { qualBadge }   from '../../utils/enums'
import { ROUTES }      from '../../utils/constants'

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-orange-500',
  'bg-rose-500', 'bg-teal-500', 'bg-indigo-500', 'bg-amber-500',
]

function avatarColor(name) {
  const sum = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return AVATAR_COLORS[sum % AVATAR_COLORS.length]
}

function initials(firstName, lastName) {
  return [(firstName ?? '')[0], (lastName ?? '')[0]].filter(Boolean).join('').toUpperCase()
}

function AthleteRow({ athlete, t }) {
  const name  = `${athlete.firstName} ${athlete.lastName}`
  const qual  = qualBadge(athlete.qualification, t)
  const since = athlete.trainingStartDate
    ? new Date(athlete.trainingStartDate).toLocaleDateString(t('dashboard.dateLocale'), { month: 'short', year: 'numeric' })
    : null

  return (
    <div className="flex items-center justify-between py-3 px-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <Link
          to={ROUTES.ATHLETES}
          className={`h-9 w-9 rounded-full ${avatarColor(name)} flex items-center justify-center text-white text-xs font-bold shrink-0 hover:ring-2 hover:ring-offset-1 hover:ring-white/60 transition-all`}
          title={name}
        >
          {initials(athlete.firstName, athlete.lastName)}
        </Link>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
          <p className="text-xs text-gray-500 truncate">
            {qual.label}{since ? ` · ${t('athletes.since')} ${since}` : ''}
          </p>
        </div>
      </div>
      {athlete.age && (
        <span className="text-xs text-gray-400 shrink-0 ml-3">{athlete.age} {t('athletes.yr')}</span>
      )}
    </div>
  )
}

function AthleteRowSkeleton() {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-full shrink-0" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-4 w-8 rounded" />
    </div>
  )
}

export function RecentAthletes({ athletes, loading }) {
  const { t } = useLanguage()
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{t('dashboard.recentAthletes')}</h3>
          {!loading && (
            <p className="text-xs text-gray-400 mt-0.5">{t('dashboard.shown', { n: athletes.length })}</p>
          )}
        </div>
        <Link
          to={ROUTES.ATHLETES}
          className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
        >
          {t('dashboard.viewAll')} <ChevronRight size={14} />
        </Link>
      </div>
      <div className="px-5 py-1 divide-y divide-gray-50">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <AthleteRowSkeleton key={i} />)
          : athletes.length === 0
            ? <p className="py-6 text-center text-sm text-gray-400">{t('dashboard.noAthletes')}</p>
            : athletes.map((a) => <AthleteRow key={a.id} athlete={a} t={t} />)
        }
      </div>
    </div>
  )
}
