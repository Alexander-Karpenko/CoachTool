import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Trophy, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { athleteApi, athleteMaxApi, exerciseApi } from '../api'
import { useLanguage }    from '../hooks/useLanguage'
import { Badge }          from '../components/common/Badge'
import { Button }         from '../components/common/Button'
import { Modal }          from '../components/common/Modal'
import { Alert }          from '../components/common/Alert'
import { Skeleton }       from '../components/common/Skeleton'
import { ConfirmDialog }  from '../components/common/ConfirmDialog'
import { qualBadge, muscleBadge } from '../utils/enums'
import { ROUTES }         from '../utils/constants'

/* ── Add record modal ── */
function AddRecordModal({ open, onClose, onSave, exercises, t, kgLabel }) {
  const today = new Date().toISOString().split('T')[0]
  const BLANK = { exerciseId: '', maxWeight: '', recordedAt: today }
  const [form, setForm]       = useState(BLANK)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  useEffect(() => { if (open) { setForm({ ...BLANK, recordedAt: new Date().toISOString().split('T')[0] }); setError(null) } }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const setField = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSave = async () => {
    if (!form.exerciseId || !form.maxWeight) return
    setLoading(true)
    setError(null)
    try {
      await onSave({
        exerciseId: Number(form.exerciseId),
        maxWeight:  Number(form.maxWeight),
        recordedAt: form.recordedAt || new Date().toISOString().split('T')[0],
      })
    } catch (e) {
      setError(e.response?.data?.message ?? t('athleteProfile.failSave'))
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={t('athleteProfile.addRecordTitle')} size="sm">
      <div className="flex flex-col gap-4">
        <Alert message={error} onClose={() => setError(null)} />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">{t('athleteProfile.exercise')}</label>
          <select
            value={form.exerciseId}
            onChange={e => setField('exerciseId', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">{t('athleteProfile.selectExercise')}</option>
            {exercises.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            {t('athleteProfile.maxWeight')} ({kgLabel})
          </label>
          <input
            type="number" min={0} step={0.5}
            value={form.maxWeight}
            onChange={e => setField('maxWeight', e.target.value)}
            placeholder="0"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">{t('athleteProfile.date')}</label>
          <input
            type="date"
            value={form.recordedAt}
            onChange={e => setField('recordedAt', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex gap-3 pt-1 border-t border-gray-100">
          <Button type="button" variant="secondary" fullWidth onClick={onClose}>{t('common.cancel')}</Button>
          <Button type="button" fullWidth onClick={handleSave} loading={loading}
            disabled={!form.exerciseId || !form.maxWeight}>
            <Plus size={15} className="mr-1" />{t('athleteProfile.addRecord')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

/* ── History table for one exercise ── */
function HistoryTable({ records, kgLabel, t, onDelete }) {
  // records sorted asc by date (oldest first)
  const best = Math.max(...records.map(r => r.maxWeight))
  const maxBar = best > 0 ? best : 1

  return (
    <div className="mt-2 rounded-lg border border-gray-100 overflow-hidden">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100 text-right">
            <th className="px-3 py-2 text-left font-semibold text-gray-500 uppercase tracking-wide">{t('athleteProfile.date')}</th>
            <th className="px-3 py-2 font-semibold text-gray-500 uppercase tracking-wide">{t('athleteProfile.maxWeight')}</th>
            <th className="px-3 py-2 font-semibold text-gray-500 uppercase tracking-wide pr-1">{t('athleteProfile.progress')}</th>
            <th className="px-3 py-2 font-semibold text-gray-500 uppercase tracking-wide">{t('athleteProfile.change')}</th>
            <th className="px-2 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => {
            const prev   = records[i - 1]
            const change = prev ? ((r.maxWeight - prev.maxWeight) / prev.maxWeight * 100) : null
            const barPct = Math.max((r.maxWeight / maxBar) * 100, 2)
            const isBest = r.maxWeight === best

            return (
              <tr key={r.id} className={`border-b border-gray-50 last:border-0 ${isBest ? 'bg-amber-50/60' : 'hover:bg-gray-50'} transition-colors`}>
                <td className="px-3 py-2 text-gray-500">{r.recordedAt}</td>
                <td className="px-3 py-2 text-right">
                  <span className={`font-bold ${isBest ? 'text-amber-600' : 'text-gray-800'}`}>
                    {r.maxWeight} {kgLabel}
                  </span>
                  {isBest && <span className="ml-1 text-amber-400">★</span>}
                </td>
                <td className="px-3 py-2 w-24">
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${isBest ? 'bg-amber-400' : 'bg-indigo-300'}`}
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                </td>
                <td className="px-3 py-2 text-right">
                  {change != null
                    ? <span className={change >= 0 ? 'text-emerald-600 font-medium' : 'text-red-500 font-medium'}>
                        {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                      </span>
                    : <span className="text-gray-300">—</span>
                  }
                </td>
                <td className="px-2 py-2 text-right">
                  <button
                    onClick={() => onDelete(r.id)}
                    className="rounded p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title={t('athleteProfile.deleteRecord')}
                  >
                    <Trash2 size={12} />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/* ── Row for one exercise (current best + collapsible history) ── */
function ExerciseRecordRow({ records, kgLabel, t, onDelete }) {
  const [expanded, setExpanded] = useState(false)

  const mb      = muscleBadge(records[0].muscleGroup, t)
  const sorted  = [...records].sort((a, b) => new Date(a.recordedAt) - new Date(b.recordedAt))
  const best    = Math.max(...records.map(r => r.maxWeight))
  const bestRec = records.reduce((a, b) => b.maxWeight >= a.maxWeight ? b : a)
  const latest  = sorted[sorted.length - 1]

  // Growth from first record to latest
  const first  = sorted[0]
  const growth = first && first.maxWeight > 0
    ? ((latest.maxWeight - first.maxWeight) / first.maxWeight * 100)
    : null

  return (
    <div className="border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/60 transition-colors">
        <Trophy size={16} className={best > 0 ? 'text-amber-400 shrink-0' : 'text-gray-200 shrink-0'} />

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{records[0].exerciseName}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge label={mb.label} variant={mb.variant} />
            {growth != null && Math.abs(growth) > 0.05 && (
              <span className={`text-xs font-medium ${growth >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
              </span>
            )}
          </div>
        </div>

        <div className="text-right shrink-0 min-w-[80px]">
          <p className="text-lg font-bold text-indigo-600">{best} {kgLabel}</p>
          <p className="text-xs text-gray-400">{bestRec.recordedAt}</p>
        </div>

        <button
          onClick={() => setExpanded(p => !p)}
          className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors shrink-0"
        >
          {records.length} {t('athleteProfile.recordsCount')}
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>

      {expanded && (
        <div className="px-5 pb-4">
          <HistoryTable records={sorted} kgLabel={kgLabel} t={t} onDelete={onDelete} />
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   Main page
══════════════════════════════════════════════════════ */
export function AthleteProfilePage() {
  const { id }       = useParams()
  const { t }        = useLanguage()
  const kgLabel      = t('enums.unit.KG')

  const [athlete,   setAthlete]   = useState(null)
  const [records,   setRecords]   = useState([])
  const [exercises, setExercises] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)
  const [addOpen,   setAddOpen]   = useState(false)
  const [delTarget, setDelTarget] = useState(null)
  const [delLoading, setDelLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [{ data: ath }, { data: recs }, { data: exs }] = await Promise.all([
        athleteApi.getById(id),
        athleteMaxApi.getAll(id),
        exerciseApi.getAll(),
      ])
      setAthlete(ath)
      setRecords(recs)
      setExercises(exs)
    } catch (e) {
      setError(e.response?.data?.message ?? t('athleteProfile.failLoad'))
    } finally {
      setLoading(false)
    }
  }, [id, t])

  useEffect(() => { load() }, [load])

  const handleAddRecord = async (payload) => {
    const { data } = await athleteMaxApi.record(id, payload)
    setRecords(prev => [...prev, data])
    setAddOpen(false)
  }

  const handleDelete = async () => {
    setDelLoading(true)
    try {
      await athleteMaxApi.remove(id, delTarget)
      setRecords(prev => prev.filter(r => r.id !== delTarget))
      setDelTarget(null)
    } catch (e) {
      setError(e.response?.data?.message ?? t('athleteProfile.failDelete'))
      setDelTarget(null)
    } finally {
      setDelLoading(false)
    }
  }

  // Group records by exerciseId, sort groups by best weight desc
  const sortedGroups = Object.values(
    records.reduce((acc, r) => {
      if (!acc[r.exerciseId]) acc[r.exerciseId] = []
      acc[r.exerciseId].push(r)
      return acc
    }, {})
  ).sort((a, b) =>
    Math.max(...b.map(r => r.maxWeight)) - Math.max(...a.map(r => r.maxWeight))
  )

  const qb = athlete ? qualBadge(athlete.qualification, t) : null

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        to={ROUTES.ATHLETES}
        className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-500 transition-colors"
      >
        <ArrowLeft size={15} /> {t('athleteProfile.backToAthletes')}
      </Link>

      <Alert message={error} onClose={() => setError(null)} />

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-56" />
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}><Skeleton className="h-3 w-16 mb-2" /><Skeleton className="h-4 w-24" /></div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-4 border-b border-gray-50">
                <Skeleton className="h-5 w-5 rounded" />
                <div className="flex-1"><Skeleton className="h-4 w-36 mb-1.5" /><Skeleton className="h-3 w-20" /></div>
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-7 w-16 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      ) : athlete ? (
        <>
          {/* Page header */}
          <div>
            <h2 className="text-xl font-bold text-gray-900">{athlete.firstName} {athlete.lastName}</h2>
            {athlete.qualification && qb && (
              <Badge label={qb.label} variant={qb.variant} className="mt-1" />
            )}
          </div>

          {/* Athlete info card */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">{t('athleteProfile.personalInfo')}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-4">
              <div>
                <p className="text-xs text-gray-400">{t('athleteProfile.age')}</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">
                  {athlete.age ? `${athlete.age} ${t('athletes.yr')}` : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">{t('athleteProfile.weight')}</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">
                  {athlete.weight ? `${athlete.weight} ${kgLabel}` : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">{t('athleteProfile.height')}</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">
                  {athlete.height ? `${athlete.height} cm` : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">{t('athletes.tableTrainingSince')}</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">
                  {athlete.trainingStartDate ?? '—'}
                </p>
              </div>
              {athlete.contactInfo && (
                <div className="col-span-2">
                  <p className="text-xs text-gray-400">{t('athleteProfile.contact')}</p>
                  <p className="text-sm text-gray-700 mt-0.5 break-words">{athlete.contactInfo}</p>
                </div>
              )}
            </div>
          </div>

          {/* 1RM Records */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{t('athleteProfile.records')}</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {t('athleteProfile.recordsSubtitle', { n: sortedGroups.length })}
                </p>
              </div>
              <Button onClick={() => setAddOpen(true)}>
                <Plus size={14} className="mr-1.5" />{t('athleteProfile.addRecord')}
              </Button>
            </div>

            {sortedGroups.length === 0 ? (
              <div className="py-14 text-center">
                <Trophy size={36} className="text-gray-200 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-500">{t('athleteProfile.noRecords')}</p>
                <p className="text-xs text-gray-400 mt-1">{t('athleteProfile.noRecordsDesc')}</p>
              </div>
            ) : (
              sortedGroups.map((recs) => (
                <ExerciseRecordRow
                  key={recs[0].exerciseId}
                  records={recs}
                  kgLabel={kgLabel}
                  t={t}
                  onDelete={rid => setDelTarget(rid)}
                />
              ))
            )}
          </div>
        </>
      ) : null}

      {/* Add record modal */}
      <AddRecordModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={handleAddRecord}
        exercises={exercises}
        t={t}
        kgLabel={kgLabel}
      />

      {/* Delete record confirm */}
      <ConfirmDialog
        open={!!delTarget}
        onClose={() => setDelTarget(null)}
        onConfirm={handleDelete}
        loading={delLoading}
        title={t('athleteProfile.deleteRecordTitle')}
        message={t('athleteProfile.deleteRecordMessage')}
      />
    </div>
  )
}
