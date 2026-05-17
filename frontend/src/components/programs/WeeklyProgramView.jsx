import { useState, useEffect } from 'react'
import { Plus, Trash2, CalendarDays, X } from 'lucide-react'
import { exerciseApi } from '../../api'
import { useLanguage } from '../../hooks/useLanguage'
import { Modal }  from '../common/Modal'
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

/* ── Modal for adding an exercise to a specific day ── */
function DayExerciseModal({ open, dayName, dayDate, avail, exLoading, onAdd, onClose, kgLabel, t }) {
  const [form, setForm] = useState(BLANK_NEW)

  useEffect(() => { if (open) setForm(BLANK_NEW) }, [open])

  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }))

  const handleAdd = () => {
    if (!form.exerciseId || !form.sets || !form.reps) return
    const found = avail.find(e => e.value === form.exerciseId)
    onAdd({
      exerciseId:   Number(form.exerciseId),
      exerciseName: found?.label ?? '',
      sets:         Number(form.sets),
      reps:         Number(form.reps),
      weight:       form.weight ? Number(form.weight) : null,
    })
  }

  const title = dayDate ? `${dayName} · ${dayDate}` : dayName

  return (
    <Modal open={open} onClose={onClose} title={t('programs.addExercise') + ' — ' + title} size="sm">
      <div className="flex flex-col gap-4">
        {/* Exercise select */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">{t('forms.program.selectExercise')}</label>
          <select
            value={form.exerciseId}
            onChange={set('exerciseId')}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">{exLoading ? t('common.loading') : t('forms.program.selectExercise')}</option>
            {avail.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Sets / Reps / Weight */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { key: 'sets',   label: t('forms.program.sets'),   min: 1,  req: true  },
            { key: 'reps',   label: t('forms.program.reps'),   min: 1,  req: true  },
            { key: 'weight', label: kgLabel,                   min: 0,  req: false },
          ].map(({ key, label, min, req }) => (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">{label}{req && <span className="text-red-400 ml-0.5">*</span>}</label>
              <input
                type="number"
                min={min}
                value={form[key]}
                onChange={set(key)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1 border-t border-gray-100">
          <Button type="button" variant="secondary" fullWidth onClick={onClose}>{t('common.cancel')}</Button>
          <Button
            type="button"
            fullWidth
            onClick={handleAdd}
            disabled={!form.exerciseId || !form.sets || !form.reps}
          >
            <Plus size={15} className="mr-1" />{t('programs.addExercise')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

/* ── Main weekly view ── */
export function WeeklyProgramView({ program, open, onClose, onSave, onCopyNextWeek, saveLoading, copyLoading, error }) {
  const { t } = useLanguage()
  const [avail,     setAvail]     = useState([])
  const [local,     setLocal]     = useState([])
  const [dayModal,  setDayModal]  = useState(null) // { dayNum }
  const [exLoading, setExLoading] = useState(true)

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

  const locale  = t('dashboard.dateLocale')
  const kgLabel = t('enums.unit.KG')

  const dayNames = [
    t('programs.dayMon'), t('programs.dayTue'), t('programs.dayWed'), t('programs.dayThu'),
    t('programs.dayFri'), t('programs.daySat'), t('programs.daySun'),
  ]
  const dayNamesFull = [
    t('programs.dayMonFull'), t('programs.dayTueFull'), t('programs.dayWedFull'), t('programs.dayThuFull'),
    t('programs.dayFriFull'), t('programs.daySatFull'), t('programs.daySunFull'),
  ]

  const exsForDay = (day) =>
    local.map((ex, idx) => ({ ...ex, _idx: idx })).filter(ex => ex.dayOfWeek === day)

  const removeAt = (idx) => setLocal(prev => prev.filter((_, i) => i !== idx))

  const handleDayAdd = ({ exerciseId, exerciseName, sets, reps, weight }) => {
    setLocal(prev => [
      ...prev,
      {
        exerciseId, exerciseName, sets, reps, weight,
        percentageOfMax: null,
        comments:        null,
        orderIndex:      prev.length,
        dayOfWeek:       dayModal.dayNum,
        _key:            Date.now(),
      },
    ])
    setDayModal(null)
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

  /* active day info for the add-exercise modal */
  const activeDayNum  = dayModal?.dayNum
  const activeDayName = activeDayNum != null ? dayNamesFull[activeDayNum - 1] : ''
  const activeDayDate = activeDayNum != null ? dayDateStr(program.weekStartDate, activeDayNum, locale) : null

  return (
    <>
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
              <span>{t('programs.weekOf')}: <span className="font-medium text-gray-700">{weekRange}</span></span>
            )}
          </div>

          <Alert message={error} />

          {/* 7-day grid */}
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
              {DAYS.map(day => {
                const exs       = exsForDay(day)
                const isWeekend = day >= 6

                return (
                  <div
                    key={day}
                    className={[
                      'flex flex-col rounded-xl border w-48 min-h-52',
                      isWeekend ? 'border-violet-200 bg-violet-50/40' : 'border-gray-200 bg-gray-50/60',
                    ].join(' ')}
                  >
                    {/* Day header */}
                    <div className={[
                      'px-3 py-2.5 rounded-t-xl border-b',
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
                      <p className="text-xs text-indigo-500 font-medium mt-1">
                        {exs.length > 0
                          ? t('programs.exercisesCount', { n: exs.length })
                          : t('programs.noExercisesDay')}
                      </p>
                    </div>

                    {/* Exercise cards */}
                    <div className="flex-1 flex flex-col gap-1.5 p-2">
                      {exs.map(ex => (
                        <div
                          key={ex._key ?? `${day}-${ex._idx}`}
                          className="group flex items-start gap-1.5 rounded-lg bg-white border border-gray-200 px-2 py-2 shadow-sm"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-800 leading-tight truncate">
                              {ex.exerciseName}
                            </p>
                            <p className="text-xs text-indigo-600 font-semibold mt-0.5">
                              {ex.sets}×{ex.reps}
                              {ex.weight != null
                                ? <span className="text-gray-500 font-normal"> @ {ex.weight} {kgLabel}</span>
                                : null}
                              {ex.percentageOfMax != null
                                ? <span className="text-gray-500 font-normal"> @ {ex.percentageOfMax}%</span>
                                : null}
                            </p>
                          </div>
                          <button
                            onClick={() => removeAt(ex._idx)}
                            className="shrink-0 rounded p-0.5 text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add button */}
                    <button
                      onClick={() => setDayModal({ dayNum: day })}
                      className="mx-2 mb-2 flex items-center justify-center gap-1 rounded-lg border border-dashed border-gray-300 py-2 text-xs text-gray-400 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50 transition-colors"
                    >
                      <Plus size={12} />
                      {t('programs.addExercise')}
                    </button>
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
              <Button type="button" variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
              <Button type="button" onClick={handleSave} loading={saveLoading}>{t('common.saveChanges')}</Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Per-day add exercise dialog */}
      <DayExerciseModal
        open={dayModal !== null}
        dayName={activeDayName}
        dayDate={activeDayDate}
        avail={avail}
        exLoading={exLoading}
        onAdd={handleDayAdd}
        onClose={() => setDayModal(null)}
        kgLabel={kgLabel}
        t={t}
      />
    </>
  )
}
