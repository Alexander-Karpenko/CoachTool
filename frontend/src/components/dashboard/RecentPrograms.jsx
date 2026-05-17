import { Link } from 'react-router-dom'
import { ChevronRight, ClipboardList } from 'lucide-react'
import { Skeleton }    from '../common/Skeleton'
import { useLanguage } from '../../hooks/useLanguage'
import { ROUTES }      from '../../utils/constants'

function ProgramRow({ program, t }) {
  const athlete = `${program.athleteFirstName ?? ''} ${program.athleteLastName ?? ''}`.trim()
  const exCount  = program.exercises?.length ?? 0
  const weekDate = program.weekStartDate
    ? new Date(program.weekStartDate).toLocaleDateString(t('dashboard.dateLocale'), { month: 'short', day: 'numeric' })
    : null

  return (
    <div className="flex items-center justify-between py-3 px-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
          <ClipboardList size={14} className="text-indigo-600" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{program.title}</p>
          <p className="text-xs text-gray-500 truncate">
            {athlete}{weekDate ? ` · ${weekDate}` : ''}
          </p>
        </div>
      </div>
      <span className="text-xs text-gray-400 shrink-0 ml-3">{exCount} ex.</span>
    </div>
  )
}

function ProgramRowSkeleton() {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
      <Skeleton className="h-4 w-8 rounded" />
    </div>
  )
}

export function RecentPrograms({ programs, loading }) {
  const { t } = useLanguage()
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{t('dashboard.recentPrograms')}</h3>
          {!loading && (
            <p className="text-xs text-gray-400 mt-0.5">{t('dashboard.shown', { n: programs.length })}</p>
          )}
        </div>
        <Link
          to={ROUTES.TRAINING_PROGRAMS}
          className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
        >
          {t('dashboard.viewAll')} <ChevronRight size={14} />
        </Link>
      </div>
      <div className="px-5 py-1 divide-y divide-gray-50">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <ProgramRowSkeleton key={i} />)
          : programs.length === 0
            ? <p className="py-6 text-center text-sm text-gray-400">{t('dashboard.noPrograms')}</p>
            : programs.map((p) => <ProgramRow key={p.id} program={p} t={t} />)
        }
      </div>
    </div>
  )
}
