import { useState, useEffect } from 'react'
import { BarChart2, TrendingUp, TrendingDown, Dumbbell, Calendar, Activity } from 'lucide-react'
import { analyticsApi, athleteApi } from '../api'
import { useLanguage }  from '../hooks/useLanguage'
import { Button }       from '../components/common/Button'
import { Select }       from '../components/common/Select'
import { Badge }        from '../components/common/Badge'
import { Skeleton }     from '../components/common/Skeleton'
import { Alert }        from '../components/common/Alert'
import { muscleBadge }  from '../utils/enums'

function dateStr(d) { return d.toISOString().split('T')[0] }

function fmtNum(n, d = 0) {
  return n != null ? Number(n).toLocaleString(undefined, { maximumFractionDigits: d }) : '—'
}
const fmtKg  = (n, unitLabel)  => n != null ? `${fmtNum(n, 1)} ${unitLabel}` : '—'
const fmtPct = (n) => n != null ? `${n >= 0 ? '+' : ''}${fmtNum(n, 1)}%` : '—'

function StatCard({ icon: Icon, label, value, sub, subColor }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <div className="rounded-lg bg-indigo-50 p-2"><Icon size={15} className="text-indigo-600" /></div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className={`text-xs mt-1 font-medium ${subColor ?? 'text-gray-400'}`}>{sub}</p>}
    </div>
  )
}

function VolumeBar({ weekStart, totalVolume, maxVolume, dateLocale, unitLabel }) {
  const pct   = maxVolume > 0 ? Math.max((totalVolume / maxVolume) * 100, 4) : 4
  const label = new Date(weekStart).toLocaleDateString(dateLocale, { month: 'short', day: 'numeric' })
  return (
    <div className="flex-1 flex flex-col items-center gap-1.5 group min-w-0">
      <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {fmtKg(totalVolume, unitLabel)}
      </span>
      <div className="relative w-full flex items-end" style={{ height: 96 }}>
        <div
          className="w-full rounded-t-md bg-indigo-300 group-hover:bg-indigo-500 transition-colors"
          style={{ height: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 truncate w-full text-center">{label}</span>
    </div>
  )
}

function ExerciseRow({ ex, t }) {
  const mb = muscleBadge(ex.muscleGroup, t)
  const kg = t('enums.unit.KG')
  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <p className="text-sm font-medium text-gray-900">{ex.exerciseName}</p>
        <Badge label={mb.label} variant={mb.variant} className="mt-0.5" />
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 text-right">{ex.totalSets}</td>
      <td className="px-4 py-3 text-sm text-gray-600 text-right">{ex.totalReps}</td>
      <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">{fmtKg(ex.totalVolume, kg)}</td>
      <td className="px-4 py-3 text-sm text-gray-600 text-right">{ex.averageWeight ? `${fmtNum(ex.averageWeight, 1)} ${kg}` : '—'}</td>
      <td className="px-4 py-3 text-sm text-gray-500 text-right">{ex.currentMax ? `${fmtNum(ex.currentMax, 1)} ${kg}` : '—'}</td>
    </tr>
  )
}

export function AnalyticsPage() {
  const { t } = useLanguage()
  const [athletes,   setAthletes]   = useState([])
  const [athleteId,  setAthleteId]  = useState('')
  const today  = new Date()
  const ago28  = new Date(today); ago28.setDate(today.getDate() - 28)
  const [from, setFrom] = useState(dateStr(ago28))
  const [to,   setTo]   = useState(dateStr(today))

  const [report,     setReport]     = useState(null)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState(null)
  const [athLoading, setAthLoading] = useState(true)

  const dateLocale = t('dashboard.dateLocale')
  const kgLabel    = t('enums.unit.KG')

  const PRESETS = [
    { label: t('analytics.last4Weeks'),  days: 28  },
    { label: t('analytics.last3Months'), days: 90  },
    { label: t('analytics.last6Months'), days: 180 },
  ]

  useEffect(() => {
    athleteApi.getAll()
      .then(({ data }) => { setAthletes(data); if (data.length) setAthleteId(String(data[0].id)) })
      .catch(() => setError(t('analytics.failLoadAthletes')))
      .finally(() => setAthLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const applyPreset = (days) => {
    const now = new Date()
    const f   = new Date(now); f.setDate(now.getDate() - days)
    setFrom(dateStr(f)); setTo(dateStr(now))
  }

  const generate = async () => {
    if (!athleteId || !from || !to) return
    setLoading(true)
    setError(null)
    try {
      const { data } = await analyticsApi.periodReport(athleteId, from, to)
      setReport(data)
    } catch (e) {
      setError(e.response?.data?.message ?? t('analytics.failGenerateReport'))
      setReport(null)
    } finally {
      setLoading(false)
    }
  }

  const maxVol = report?.weeklyChart?.length
    ? Math.max(...report.weeklyChart.map((w) => w.totalVolume), 1)
    : 1

  const vs = report?.volumeStats

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">{t('analytics.title')}</h2>
        <p className="text-sm text-gray-500 mt-0.5">{t('analytics.subtitle')}</p>
      </div>

      <Alert message={error} onClose={() => setError(null)} />

      {/* Controls */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap gap-4 items-end">
          <Select
            label={t('analytics.athleteLabel')} value={athleteId} onChange={(e) => setAthleteId(e.target.value)}
            placeholder={athLoading ? t('common.loading') : t('common.all')}
            options={athletes.map((a) => ({ value: String(a.id), label: `${a.firstName} ${a.lastName}` }))}
            className="w-52"
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">{t('analytics.period')}</label>
            <div className="flex items-center gap-2">
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <span className="text-gray-400 text-sm">—</span>
              <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          <div className="flex gap-2">
            {PRESETS.map((p) => (
              <button key={p.days} onClick={() => applyPreset(p.days)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                {p.label}
              </button>
            ))}
          </div>

          <Button onClick={generate} loading={loading} disabled={!athleteId}>
            <BarChart2 size={15} className="mr-1.5" /> {t('analytics.generateReport')}
          </Button>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <Skeleton className="h-4 w-24 mb-3" />
                <Skeleton className="h-7 w-20 mb-2" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <Skeleton className="h-5 w-40 mb-5" />
            <div className="flex items-end gap-2" style={{ height: 120 }}>
              {[55,75,40,95,65,30,85,50,70,45,90,60].map((h,i) => (
                <div key={i} className="flex-1 flex items-end" style={{ height: 96 }}>
                  <Skeleton className="w-full rounded-t-md" style={{ height: `${h}%` }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Report */}
      {!loading && report && vs && (
        <>
          {/* Athlete name */}
          <p className="text-sm font-medium text-gray-500">
            {t('analytics.reportFor')} <span className="text-gray-900 font-semibold">{vs.athleteFirstName} {vs.athleteLastName}</span>
            {' · '}{from} — {to}
          </p>

          {/* Stats cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Activity}   label={t('analytics.totalVolume')}      value={fmtKg(vs.totalVolume, kgLabel)}
              sub={fmtPct(vs.volumeChangePercent)} subColor={vs.volumeChangePercent >= 0 ? 'text-emerald-600' : 'text-red-500'} />
            <StatCard icon={BarChart2}  label={t('analytics.avgWeeklyVolume')}  value={fmtKg(vs.averageWeeklyVolume, kgLabel)} />
            <StatCard icon={TrendingUp} label={t('analytics.peakWeeklyVolume')} value={fmtKg(vs.peakWeeklyVolume, kgLabel)} />
            <StatCard icon={Dumbbell}   label={t('analytics.avgIntensity')}     value={vs.averageIntensity ? `${fmtNum(vs.averageIntensity, 1)}%` : '—'}
              sub={fmtPct(vs.intensityChangePercent)} subColor={vs.intensityChangePercent >= 0 ? 'text-emerald-600' : 'text-red-500'} />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Calendar} label={t('analytics.programs')}  value={fmtNum(vs.totalPrograms)} />
            <StatCard icon={Dumbbell} label={t('analytics.exercises')} value={fmtNum(vs.totalExercises)} />
          </div>

          {/* Weekly volume chart */}
          {report.weeklyChart?.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-5">{t('analytics.weeklyVolume')}</h3>
              <div className="flex items-end gap-2" style={{ height: 136 }}>
                {report.weeklyChart.map((w) => (
                  <VolumeBar key={w.weekStart} weekStart={w.weekStart} totalVolume={w.totalVolume}
                    maxVolume={maxVol} dateLocale={dateLocale} unitLabel={kgLabel} />
                ))}
              </div>
            </div>
          )}

          {/* Exercise breakdown */}
          {report.exerciseSummaries?.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900">{t('analytics.exerciseBreakdown')}</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 text-right">
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left">{t('analytics.exercises')}</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('analytics.sets')}</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('analytics.reps')}</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('analytics.volume')}</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('analytics.avgWeight')}</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('analytics.oneRM')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.exerciseSummaries.map((ex) => <ExerciseRow key={ex.exerciseId} ex={ex} t={t} />)}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {report.weeklyChart?.length === 0 && report.exerciseSummaries?.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
              <p className="text-sm text-gray-400">{t('analytics.noData')}</p>
            </div>
          )}
        </>
      )}

      {/* Prompt when nothing loaded */}
      {!loading && !report && !error && (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
          <BarChart2 size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-500">{t('analytics.selectPrompt')}</p>
        </div>
      )}
    </div>
  )
}
