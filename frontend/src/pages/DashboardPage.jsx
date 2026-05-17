import { useAuth }          from '../hooks/useAuth'
import { useLanguage }      from '../hooks/useLanguage'
import { useDashboardData } from '../hooks/useDashboardData'
import { StatsCard }        from '../components/dashboard/StatsCard'
import { RecentAthletes }   from '../components/dashboard/RecentAthletes'
import { RecentPrograms }   from '../components/dashboard/RecentPrograms'
import { QuickActions }     from '../components/dashboard/QuickActions'

export function DashboardPage() {
  const { user }          = useAuth()
  const { t }             = useLanguage()
  const { loading, data } = useDashboardData()

  const greeting = user?.firstName
    ? t('dashboard.greetingName', { name: user.firstName })
    : t('dashboard.greeting')

  const today = new Date().toLocaleDateString(t('dashboard.dateLocale'), {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  const statLabels = {
    athletes:  t('dashboard.statAthletes'),
    programs:  t('dashboard.statPrograms'),
    exercises: t('dashboard.statExercises'),
    planned:   t('dashboard.statPlanned'),
  }

  const translatedStats = data.stats.map((s) => ({ ...s, label: statLabels[s.id] ?? s.id }))

  return (
    <div className="space-y-6">
      {/* Page intro */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">{greeting}</h2>
        <p className="text-sm text-gray-500 mt-0.5">{today}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <StatsCard key={i} loading />)
          : translatedStats.map((s) => <StatsCard key={s.id} {...s} loading={false} />)
        }
      </div>

      {/* Middle row: Athletes (2/3) + Quick Actions (1/3) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentAthletes athletes={data.athletes} loading={loading} />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Bottom row: Recent Programs (full width) */}
      <RecentPrograms programs={data.programs} loading={loading} />
    </div>
  )
}
