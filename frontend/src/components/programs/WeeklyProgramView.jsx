import { useState, useEffect } from 'react'
import { Plus, CalendarDays, X, Pencil, GripVertical } from 'lucide-react'
import { exerciseApi } from '../../api'
import { useLanguage } from '../../hooks/useLanguage'
import { Modal }  from '../common/Modal'
import { Button } from '../common/Button'
import { Alert }  from '../common/Alert'

const DAYS = [1, 2, 3, 4, 5, 6, 7]

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

/* ── Shared form fields for add / edit ── */
function ExerciseFields({ form, setField, avail, exLoading, kgLabel, t, showExerciseSelect }) {
  return (
    <div className="flex flex-col gap-4">
      {showExerciseSelect && (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">{t('forms.program.selectExercise')}</label>
          <select
            value={form.exerciseId}
            onChange={e => setField('exerciseId', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">{exLoading ? t('common.loading') : t('forms.program.selectExercise')}</option>
            {avail.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        {[
          { key: 'sets',   label: t('forms.program.sets'), min: 1, req: true  },
          { key: 'reps',   label: t('forms.program.reps'), min: 1, req: true  },
          { key: 'weight', label: kgLabel,                 min: 0, req: false },
        ].map(({ key, label, min, req }) => (
          <div key={key} className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              {label}{req && <span className="text-red-400 ml-0.5">*</span>}
            </label>
            <input
              type="number" min={min}
              value={form[key] ?? ''}
              onChange={e => setField(key, e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">{t('forms.program.percentOfMax')}</label>
          <input
            type="number" min={0} max={100}
            value={form.percentageOfMax ?? ''}
            onChange={e => setField('percentageOfMax', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">{t('forms.program.comments')}</label>
          <input
            type="text"
            value={form.comments ?? ''}
            onChange={e => setField('comments', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  )
}

/* ── Add exercise to a day ── */
function AddExerciseModal({ open, title, avail, exLoading, onAdd, onClose, kgLabel, t }) {
  const BLANK = { exerciseId: '', sets: '', reps: '', weight: '', percentageOfMax: '', comments: '' }
  const [form, setForm] = useState(BLANK)

  useEffect(() => { if (open) setForm(BLANK) }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const setField = (key, val) => setForm(p => ({ ...p, [key]: val }))

  const handleAdd = () => {
    if (!form.exerciseId || !form.sets || !form.reps) return
    const found = avail.find(e => e.value === form.exerciseId)
    onAdd({
      exerciseId:      Number(form.exerciseId),
      exerciseName:    found?.label ?? '',
      sets:            Number(form.sets),
      reps:            Number(form.reps),
      weight:          form.weight          ? Number(form.weight)          : null,
      percentageOfMax: form.percentageOfMax ? Number(form.percentageOfMax) : null,
      comments:        form.comments        || null,
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={`${t('programs.addExercise')} — ${title}`} size="sm">
      <div className="flex flex-col gap-4">
        <ExerciseFields form={form} setField={setField} avail={avail} exLoading={exLoading}
          kgLabel={kgLabel} t={t} showExerciseSelect />
        <div className="flex gap-3 pt-1 border-t border-gray-100">
          <Button type="button" variant="secondary" fullWidth onClick={onClose}>{t('common.cancel')}</Button>
          <Button type="button" fullWidth onClick={handleAdd}
            disabled={!form.exerciseId || !form.sets || !form.reps}>
            <Plus size={15} className="mr-1" />{t('programs.addExercise')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

/* ── Edit existing exercise ── */
function EditExerciseModal({ open, exercise, avail, exLoading, onSave, onClose, kgLabel, t }) {
  const [form, setForm] = useState({})

  useEffect(() => {
    if (open && exercise) {
      setForm({
        exerciseId:      String(exercise.exerciseId ?? ''),
        sets:            String(exercise.sets ?? ''),
        reps:            String(exercise.reps ?? ''),
        weight:          exercise.weight          != null ? String(exercise.weight)          : '',
        percentageOfMax: exercise.percentageOfMax != null ? String(exercise.percentageOfMax) : '',
        comments:        exercise.comments ?? '',
      })
    }
  }, [open, exercise])

  const setField = (key, val) => setForm(p => ({ ...p, [key]: val }))

  const handleSave = () => {
    if (!form.exerciseId || !form.sets || !form.reps) return
    const found = avail.find(e => e.value === form.exerciseId)
    onSave({
      exerciseId:      Number(form.exerciseId),
      exerciseName:    found?.label ?? exercise?.exerciseName ?? '',
      sets:            Number(form.sets),
      reps:            Number(form.reps),
      weight:          form.weight          ? Number(form.weight)          : null,
      percentageOfMax: form.percentageOfMax ? Number(form.percentageOfMax) : null,
      comments:        form.comments        || null,
    })
  }

  if (!exercise) return null

  return (
    <Modal open={open} onClose={onClose} title={`${t('programs.editExercise')} — ${exercise.exerciseName}`} size="sm">
      <div className="flex flex-col gap-4">
        <ExerciseFields form={form} setField={setField} avail={avail} exLoading={exLoading}
          kgLabel={kgLabel} t={t} showExerciseSelect />
        <div className="flex gap-3 pt-1 border-t border-gray-100">
          <Button type="button" variant="secondary" fullWidth onClick={onClose}>{t('common.cancel')}</Button>
          <Button type="button" fullWidth onClick={handleSave}
            disabled={!form.exerciseId || !form.sets || !form.reps}>
            {t('common.saveChanges')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

/* ── Exercise card (draggable) ── */
function ExerciseCard({ ex, isDragging, isDragTarget, kgLabel, onEdit, onRemove,
                        onDragStart, onDragEnd, onDragOver, onDrop, onDragLeave }) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragLeave={onDragLeave}
      className={[
        'group flex items-center gap-1.5 rounded-lg bg-white border px-2 py-2 shadow-sm',
        'cursor-grab active:cursor-grabbing select-none transition-all',
        isDragging   ? 'opacity-40 border-indigo-300 shadow-md' : 'border-gray-200 hover:border-gray-300',
        isDragTarget ? 'border-t-[3px] border-t-indigo-500' : '',
      ].join(' ')}
    >
      {/* Drag handle */}
      <GripVertical size={13} className="text-gray-300 shrink-0 group-hover:text-gray-400 transition-colors" />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-800 leading-tight truncate">{ex.exerciseName}</p>
        <p className="text-xs text-indigo-600 font-semibold mt-0.5 leading-tight">
          {ex.sets}×{ex.reps}
          {ex.weight          != null ? <span className="text-gray-500 font-normal"> @ {ex.weight} {kgLabel}</span>  : null}
          {ex.percentageOfMax != null ? <span className="text-gray-500 font-normal"> @ {ex.percentageOfMax}%</span>  : null}
        </p>
        {ex.comments && (
          <p className="text-xs text-gray-400 mt-0.5 truncate">{ex.comments}</p>
        )}
      </div>

      {/* Action buttons (visible on hover) */}
      <div className="flex gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={e => { e.stopPropagation(); onEdit() }}
          className="rounded p-1 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
        >
          <Pencil size={11} />
        </button>
        <button
          onClick={e => { e.stopPropagation(); onRemove() }}
          className="rounded p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <X size={11} />
        </button>
      </div>
    </div>
  )
}

/* ── Day column ── */
function DayColumn({ day, dayName, dateStr, exs, isWeekend, isDragOver, draggingIdx,
                     kgLabel, t, onAddClick,
                     onDragEnter, onDragOver, onDragLeave, onDrop,
                     dragOverCardIdx, onCardDragStart, onCardDragEnd,
                     onCardDragOver, onCardDrop, onCardDragLeave,
                     onCardEdit, onCardRemove }) {
  return (
    <div
      className={[
        'flex flex-col rounded-xl border w-48 min-h-60 transition-all duration-150',
        isDragOver
          ? 'border-indigo-400 bg-indigo-50/70 ring-2 ring-indigo-300 ring-offset-1'
          : isWeekend
            ? 'border-violet-200 bg-violet-50/40'
            : 'border-gray-200 bg-gray-50/60',
      ].join(' ')}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* Header */}
      <div className={[
        'px-3 py-2.5 rounded-t-xl border-b',
        isDragOver ? 'border-indigo-300' : isWeekend ? 'border-violet-200' : 'border-gray-200',
      ].join(' ')}>
        <p className={[
          'text-xs font-bold uppercase tracking-widest',
          isWeekend ? 'text-violet-600' : 'text-gray-500',
        ].join(' ')}>
          {dayName}
        </p>
        {dateStr && <p className="text-xs text-gray-400 mt-0.5">{dateStr}</p>}
        <p className={[
          'text-xs font-medium mt-1',
          exs.length > 0 ? 'text-indigo-500' : 'text-gray-300',
        ].join(' ')}>
          {exs.length > 0 ? t('programs.exercisesCount', { n: exs.length }) : t('programs.noExercisesDay')}
        </p>
      </div>

      {/* Exercise cards */}
      <div className="flex-1 flex flex-col gap-1.5 p-2">
        {exs.map(ex => (
          <ExerciseCard
            key={ex._key ?? `${day}-${ex._idx}`}
            ex={ex}
            isDragging={draggingIdx === ex._idx}
            isDragTarget={dragOverCardIdx === ex._idx}
            kgLabel={kgLabel}
            onEdit={() => onCardEdit(ex._idx)}
            onRemove={() => onCardRemove(ex._idx)}
            onDragStart={e => onCardDragStart(e, ex._idx)}
            onDragEnd={onCardDragEnd}
            onDragOver={e => onCardDragOver(e, ex._idx)}
            onDrop={e => onCardDrop(e, ex._idx)}
            onDragLeave={onCardDragLeave}
          />
        ))}

        {/* Drop hint when dragging over an empty day */}
        {isDragOver && exs.length === 0 && (
          <div className="flex-1 rounded-lg border-2 border-dashed border-indigo-300 flex items-center justify-center min-h-12">
            <p className="text-xs text-indigo-400">{t('programs.dropHere')}</p>
          </div>
        )}
      </div>

      {/* Add button */}
      <button
        onClick={onAddClick}
        className="mx-2 mb-2 flex items-center justify-center gap-1 rounded-lg border border-dashed border-gray-300 py-2 text-xs text-gray-400 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50 transition-colors"
      >
        <Plus size={12} />{t('programs.addExercise')}
      </button>
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   Main component
══════════════════════════════════════════════════════ */
export function WeeklyProgramView({ program, open, onClose, onSave, onCopyNextWeek, saveLoading, copyLoading, error }) {
  const { t } = useLanguage()

  const [avail,       setAvail]       = useState([])
  const [local,       setLocal]       = useState([])
  const [exLoading,   setExLoading]   = useState(true)

  // Add modal: null | { dayNum }
  const [addModal,  setAddModal]  = useState(null)
  // Edit modal: null | { idx }
  const [editModal, setEditModal] = useState(null)

  // DnD state
  const [draggingIdx,    setDraggingIdx]    = useState(null)
  const [dragOverDay,    setDragOverDay]    = useState(null)
  const [dragOverCardIdx, setDragOverCardIdx] = useState(null)

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

  /* ── Helpers ── */
  const exsForDay = (day) =>
    local.map((ex, idx) => ({ ...ex, _idx: idx })).filter(ex => ex.dayOfWeek === day)

  const removeAt = (idx) => setLocal(prev => prev.filter((_, i) => i !== idx))

  /* ── Add ── */
  const handleDayAdd = (dayNum, data) => {
    setLocal(prev => [
      ...prev,
      { ...data, percentageOfMax: data.percentageOfMax ?? null, comments: data.comments ?? null,
        orderIndex: prev.length, dayOfWeek: dayNum, _key: Date.now() },
    ])
    setAddModal(null)
  }

  /* ── Edit ── */
  const handleEdit = (updates) => {
    setLocal(prev => prev.map((ex, i) =>
      i === editModal.idx ? { ...ex, ...updates } : ex
    ))
    setEditModal(null)
  }

  /* ── Drag & Drop ── */
  const onCardDragStart = (e, idx) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(idx))
    // small timeout so the drag image renders before opacity drops
    requestAnimationFrame(() => setDraggingIdx(idx))
  }

  const onCardDragEnd = () => {
    setDraggingIdx(null)
    setDragOverDay(null)
    setDragOverCardIdx(null)
  }

  const onColumnDragEnter = (e, day) => {
    e.preventDefault()
    setDragOverDay(day)
  }

  const onColumnDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const onColumnDragLeave = (e, day) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverDay(prev => prev === day ? null : prev)
    }
  }

  const onColumnDrop = (e, targetDay) => {
    e.preventDefault()
    const idx = parseInt(e.dataTransfer.getData('text/plain'), 10)
    if (!isNaN(idx) && idx >= 0 && idx < local.length) {
      setLocal(prev => prev.map((ex, i) => i === idx ? { ...ex, dayOfWeek: targetDay } : ex))
    }
    setDraggingIdx(null)
    setDragOverDay(null)
    setDragOverCardIdx(null)
  }

  /* ── Card-level DnD (within-day and cross-day reorder) ── */
  const onCardItemDragOver = (e, targetIdx) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverCardIdx !== targetIdx) setDragOverCardIdx(targetIdx)
  }

  const onCardItemDrop = (e, targetIdx) => {
    e.preventDefault()
    e.stopPropagation()
    const srcIdx = parseInt(e.dataTransfer.getData('text/plain'), 10)
    if (!isNaN(srcIdx) && srcIdx >= 0 && srcIdx < local.length && srcIdx !== targetIdx) {
      setLocal(prev => {
        const next = [...prev]
        const [moved] = next.splice(srcIdx, 1)
        const insertAt = srcIdx < targetIdx ? targetIdx - 1 : targetIdx
        const targetDay = next[insertAt]?.dayOfWeek ?? moved.dayOfWeek
        next.splice(insertAt, 0, { ...moved, dayOfWeek: targetDay })
        return next
      })
    }
    setDraggingIdx(null)
    setDragOverDay(null)
    setDragOverCardIdx(null)
  }

  const onCardItemDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setDragOverCardIdx(null)
  }

  /* ── Save ── */
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

  const weekRange     = weekRangeStr(program.weekStartDate, locale)
  const addDayNum     = addModal?.dayNum
  const addTitle      = addDayNum != null
    ? (program.weekStartDate
        ? `${dayNamesFull[addDayNum - 1]} · ${dayDateStr(program.weekStartDate, addDayNum, locale)}`
        : dayNamesFull[addDayNum - 1])
    : ''
  const editingEx     = editModal != null ? local[editModal.idx] : null

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
            <span className="font-semibold text-gray-800">
              {program.athleteFirstName} {program.athleteLastName}
            </span>
            {weekRange && (
              <span>{t('programs.weekOf')}: <span className="font-medium text-gray-700">{weekRange}</span></span>
            )}
            {draggingIdx !== null && (
              <span className="text-indigo-500 text-xs font-medium animate-pulse">
                ↔ {t('programs.dragging')}
              </span>
            )}
          </div>

          <Alert message={error} />

          {/* 7-day grid */}
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
              {DAYS.map(day => (
                <DayColumn
                  key={day}
                  day={day}
                  dayName={dayNames[day - 1]}
                  dateStr={dayDateStr(program.weekStartDate, day, locale)}
                  exs={exsForDay(day)}
                  isWeekend={day >= 6}
                  isDragOver={dragOverDay === day}
                  draggingIdx={draggingIdx}
                  kgLabel={kgLabel}
                  t={t}
                  onAddClick={() => setAddModal({ dayNum: day })}
                  onDragEnter={e => onColumnDragEnter(e, day)}
                  onDragOver={onColumnDragOver}
                  onDragLeave={e => onColumnDragLeave(e, day)}
                  onDrop={e => onColumnDrop(e, day)}
                  dragOverCardIdx={dragOverCardIdx}
                  onCardDragStart={(e, idx) => onCardDragStart(e, idx)}
                  onCardDragEnd={onCardDragEnd}
                  onCardDragOver={(e, idx) => onCardItemDragOver(e, idx)}
                  onCardDrop={(e, idx) => onCardItemDrop(e, idx)}
                  onCardDragLeave={onCardItemDragLeave}
                  onCardEdit={idx => setEditModal({ idx })}
                  onCardRemove={idx => removeAt(idx)}
                />
              ))}
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

      {/* Add exercise dialog */}
      <AddExerciseModal
        open={addModal !== null}
        title={addTitle}
        avail={avail}
        exLoading={exLoading}
        onAdd={data => handleDayAdd(addModal.dayNum, data)}
        onClose={() => setAddModal(null)}
        kgLabel={kgLabel}
        t={t}
      />

      {/* Edit exercise dialog */}
      <EditExerciseModal
        open={editModal !== null}
        exercise={editingEx}
        avail={avail}
        exLoading={exLoading}
        onSave={handleEdit}
        onClose={() => setEditModal(null)}
        kgLabel={kgLabel}
        t={t}
      />
    </>
  )
}
