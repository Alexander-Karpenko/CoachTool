import { useState, useEffect } from 'react'
import { Plus, Trash2, CalendarDays } from 'lucide-react'
import { exerciseApi } from '../../api'
import { useLanguage } from '../../hooks/useLanguage'
import { Modal }  from '../common/Modal'
import { Select } from '../common/Select'
import { Input }  from '../common/Input'
import { Button } from '../common/Button'
import { Alert }  from '../common/Alert'

const DAYS = [1, 2, 3, 4, 5, 6, 7]

const BLANK_NEW = { exerciseId: '', sets: '', reps: '', weight: '' }

function dayDateStr(weekStartDate, dayNum, locale) {
  if (!weekStartDate) return null
  const d = new Date(weekStartDate)
  d.setDate(d.getDate() + (dayNum - 1))
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'short' })
}

function weekRangeStr(weekStartDate, locale) {
  if (!weekStartDate) return null
  const start = new Date(weekStartDate)
  const end   = new Date(weekStartDate)
  end.setDate(start.getDate() + 6)
  return `${start.toLocaleDateString(locale, { day: 'numeric', month: 'short' })} – ${end.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })}`
}

export function WeeklyProgramView({ program, open, onClose, onSave, onCopyNextWeek, saveLoading, copyLoading, error }) {
  const { t } = useLanguage()
  const [avail,      setAvail]      = useState([])
  const [local,      setLocal]      = useState([])
  const [addingDay,  setAddingDay]  = useState(null)
  const [newEx,      setNewEx]      = useState(BLANK_NEW)
  const [exLoading,  setExLoading]  = useState(true)

  useEffect(() => {
    exerciseApi.getAll()
      .then(({ data }) => setAvail(data.map(e => ({ value: String(e.id), label: e.name }))))
      .catch(() => {})
      .finally(() => setExLoading(false))
  }, [])

  useEffect(() => {
    if (!program) return
    setLocal(
      (program.exercises ?? []).map((ex, i) => ({
        ...ex,
        dayOfWeek: ex.dayOfWeek ?? 1,
        _key: i,
      }))
    )
  }, [program])

  if (!program) return null

  const dayNames = [
    t('programs.dayMon'), t('programs.dayTue'), t('programs.dayWed'), t('programs.dayThu'),
    t('programs.dayFri'), t('programs.daySat'), t('programs.daySun'),
  ]
  const locale    = t('dashboard.dateLocale')
  const kgLabel   = t('enums.unit.KG')

  const exsForDay = (day) =>
    local.map((ex, idx) => ({ ...ex, _idx: idx })).filter(ex => ex.dayOfWeek === day)

  const removeAt = (idx) => setLocal(prev => prev.filter((_, i) => i !== idx))

  const startAdd = (day) => {
    setAddingDay(day)
    setNewEx(BLANK_NEW)
  }

  const confirmAdd = () => {
    if (!newEx.exerciseId || !newEx.sets || !newEx.reps) return
    const found = avail.find(e => e.value === newEx.exerciseId)
    setLocal(prev => [
      ...prev,
      {
        exerciseId:      Number(newEx.exerciseId),
        exerciseName:    found?.label ?? '',
        sets:            Number(newEx.sets),
        reps:            Number(newEx.reps),
        weight:          newEx.weight ? Number(newEx.weight) : null,
        percentageOfMax: null,
        comments:        null,
        orderIndex:      prev.length,
        dayOfWeek:       addingDay,
        _key:            Date.now(),
      },
    ])
    setAddingDay(null)
  }

  const handleSave = () => {
    onSave(local.map((ex, i) => ({
      exerciseId:      Number(ex.exerciseId),
      sets:            Number(ex.sets),
      reps:            Number(ex.reps),
      weight:          ex.weight          ?? null,
      percentageOfMax: ex.percentageOfMax ?? null,
      comments:        ex.comments        ?? null,
      orderIndex:      i,
      dayOfWeek:       ex.dayOfWeek,
    })))
  }

  const weekRange = weekRangeStr(program.weekStartDate, locale)

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${t('programs.weeklyView')} — ${program.title}`}
      size="full"
    >
      <div className="flex flex-col gap-4">
        {/* Info row */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <span className="font-semibold text-gray-800">{program.athleteFirstName} {program.athleteLastName}</span>
          {weekRange && (
            <span>
              {t('programs.weekOf')}: <span className="font-medium text-gray-700">{weekRange}</span>
            </span>
          )}
        </div>

        <Alert message={error} />

        {/* 7-day grid */}
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
            {DAYS.map(day => {
              const exs       = exsForDay(day)
              const isAdding  = addingDay === day
              const isWeekend = day >= 6

              return (
                <div
                  key={day}
                  className={[
                    'flex flex-col rounded-xl border w-44 min-h-52',
                    isWeekend
                      ? 'border-violet-200 bg-violet-50/40'
                      : 'border-gray-200 bg-gray-50/60',
                  ].join(' ')}
                >
                  {/* Day header */}
                  <div className={[
                    'px-3 py-2 rounded-t-xl border-b',
                    isWeekend ? 'border-violet-200' : 'border-gray-200',
                  ].join(' ')}>
                    <p className={[
                      'text-xs font-bold uppercase tracking-widest',
                      isWeekend ? 'text-violet-600' : 'text-gray-500',
                    ].join(' ')}>
                      {dayNames[day - 1]}
                    </p>
                    {program.weekStartDate && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {dayDateStr(program.weekStartDate, day, locale)}
                      </p>
                    )}
                  </div>

                  {/* Exercise cards */}
                  <div className="flex-1 flex flex-col gap-1.5 p-2">
                    {exs.length === 0 && !isAdding && (
                      <p className="text-xs text-gray-300 text-center mt-4 select-none">
                        {t('programs.noExercisesDay')}
                      </p>
                    )}

                    {exs.map(ex => (
                      <div
                        key={ex._key ?? `${day}-${ex._idx}`}
                        className="group flex items-start gap-1.5 rounded-lg bg-white border border-gray-200 px-2 py-1.5 shadow-sm"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-800 leading-tight truncate">
                            {ex.exerciseName}
                          </p>
                          <p className="text-xs text-indigo-600 font-semibold mt-0.5">
                            {ex.sets}×{ex.reps}
                            {ex.weight
                              ? <span className="text-gray-500 font-normal"> @ {ex.weight} {kgLabel}</span>
                              : null}
                            {ex.percentageOfMax
                              ? <span className="text-gray-500 font-normal"> @ {ex.percentageOfMax}%</span>
                              : null}
                          </p>
                        </div>
                        <button
                          onClick={() => removeAt(ex._idx)}
                          className="shrink-0 rounded p-0.5 text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}

                    {/* Inline add form */}
                    {isAdding && (
                      <div className="rounded-lg border border-indigo-300 bg-white p-2 shadow-sm space-y-1.5">
                        <select
                          value={newEx.exerciseId}
                          onChange={e => setNewEx(p => ({ ...p, exerciseId: e.target.value }))}
                          className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">
                            {exLoading ? t('common.loading') : t('forms.program.selectExercise')}
                          </option>
                          {avail.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>

                        <div className="grid grid-cols-3 gap-1">
                          {[
                            { key: 'sets',   ph: t('forms.program.sets'),   min: 1 },
                            { key: 'reps',   ph: t('forms.program.reps'),   min: 1 },
                            { key: 'weight', ph: kgLabel,                   min: 0 },
                          ].map(({ key, ph, min }) => (
                            <input
                              key={key}
                              type="number"
                              min={min}
                              placeholder={ph}
                              value={newEx[key]}
                              onChange={e => setNewEx(p => ({ ...p, [key]: e.target.value }))}
                              className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          ))}
                        </div>

                        <div className="flex gap-1">
                          <button
                            onClick={confirmAdd}
                            disabled={!newEx.exerciseId || !newEx.sets || !newEx.reps}
                            className="flex-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs py-1.5 font-medium transition-colors"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => setAddingDay(null)}
                            className="flex-1 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-600 text-xs py-1.5 font-medium transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Add button */}
                  {!isAdding && (
                    <button
                      onClick={() => startAdd(day)}
                      className="mx-2 mb-2 flex items-center justify-center gap-1 rounded-lg border border-dashed border-gray-300 py-1.5 text-xs text-gray-400 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50 transition-colors"
                    >
                      <Plus size={12} />
                      {t('programs.addExercise')}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <Button type="button" variant="secondary" onClick={onCopyNextWeek} loading={copyLoading}>
            <CalendarDays size={15} className="mr-1.5" />
            {t('programs.copyNextWeek')}
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="button" onClick={handleSave} loading={saveLoading}>
              {t('common.saveChanges')}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
