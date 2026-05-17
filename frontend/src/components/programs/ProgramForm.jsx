import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { exerciseApi }   from '../../api'
import { useLanguage }   from '../../hooks/useLanguage'
import { Input }     from '../common/Input'
import { Select }    from '../common/Select'
import { Textarea }  from '../common/Textarea'
import { Button }    from '../common/Button'
import { Alert }     from '../common/Alert'

const blankEx   = () => ({ exerciseId: '', sets: '', reps: '', weight: '', percentageOfMax: '', comments: '', orderIndex: 0 })
const blankForm = { title: '', athleteId: '', weekStartDate: '', notes: '', exercises: [blankEx()] }

export function ProgramForm({ initial, athletes, onSubmit, onClose, loading, error }) {
  const { t } = useLanguage()
  const [form, setForm]           = useState(initial ? toFormState(initial) : blankForm)
  const [exercises, setExercises] = useState([])
  const [exLoading, setExLoading] = useState(true)

  useEffect(() => {
    exerciseApi.getAll()
      .then(({ data }) => setExercises(data.map((e) => ({ value: String(e.id), label: e.name }))))
      .catch(() => {})
      .finally(() => setExLoading(false))
  }, [])

  function toFormState(p) {
    return {
      title:         p.title ?? '',
      athleteId:     String(p.athleteId ?? ''),
      weekStartDate: p.weekStartDate ?? '',
      notes:         p.notes ?? '',
      exercises:     p.exercises?.length
        ? p.exercises.map((e) => ({
            exerciseId:      String(e.exerciseId),
            sets:            String(e.sets),
            reps:            String(e.reps),
            weight:          e.weight != null ? String(e.weight) : '',
            percentageOfMax: e.percentageOfMax != null ? String(e.percentageOfMax) : '',
            comments:        e.comments ?? '',
            orderIndex:      e.orderIndex,
          }))
        : [blankEx()],
    }
  }

  const setField  = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  const setExField = (idx, e) => {
    const { name, value } = e.target
    setForm((p) => {
      const exs = [...p.exercises]
      exs[idx] = { ...exs[idx], [name]: value }
      return { ...p, exercises: exs }
    })
  }

  const addEx    = ()    => setForm((p) => ({ ...p, exercises: [...p.exercises, { ...blankEx(), orderIndex: p.exercises.length }] }))
  const removeEx = (i)   => setForm((p) => ({ ...p, exercises: p.exercises.filter((_, j) => j !== i).map((e, j) => ({ ...e, orderIndex: j })) }))

  const submit = (e) => {
    e.preventDefault()
    onSubmit({
      title:         form.title,
      athleteId:     Number(form.athleteId),
      weekStartDate: form.weekStartDate || null,
      notes:         form.notes || null,
      exercises:     form.exercises.map((ex, i) => ({
        exerciseId:      Number(ex.exerciseId),
        sets:            Number(ex.sets),
        reps:            Number(ex.reps),
        weight:          ex.weight          ? Number(ex.weight)          : null,
        percentageOfMax: ex.percentageOfMax ? Number(ex.percentageOfMax) : null,
        comments:        ex.comments || null,
        orderIndex:      i,
      })),
    })
  }

  const athleteOptions = athletes.map((a) => ({ value: String(a.id), label: `${a.firstName} ${a.lastName}` }))

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Alert message={error} />

      <div className="grid grid-cols-2 gap-3">
        <Input id="title" name="title" label={t('forms.program.title')} placeholder={t('forms.program.titlePlaceholder')}
          value={form.title} onChange={setField} required className="col-span-2 sm:col-span-1" />
        <Select id="athleteId" name="athleteId" label={t('nav.athletes')} value={form.athleteId} onChange={setField}
          required placeholder={t('common.all')} options={athleteOptions} />
      </div>

      <Input id="weekStartDate" name="weekStartDate" label={t('forms.program.weekStartDate')}
        type="date" value={form.weekStartDate} onChange={setField} />

      <Textarea id="notes" name="notes" label={t('forms.program.notes')}
        placeholder={t('forms.program.notesPlaceholder')} value={form.notes} onChange={setField} rows={2} />

      {/* Exercises */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-900">{t('forms.program.exercises', { n: form.exercises.length })}</p>
          <Button type="button" variant="ghost" size="sm" onClick={addEx}><Plus size={14} className="mr-1" />{t('forms.program.addRow')}</Button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {form.exercises.map((ex, i) => (
            <div key={i} className="flex gap-2 items-start rounded-lg border border-gray-200 p-2.5 bg-gray-50">
              <span className="text-xs text-gray-400 font-medium pt-2 w-5 shrink-0">{i + 1}</span>

              <div className="flex-1 grid grid-cols-2 sm:grid-cols-6 gap-2 min-w-0">
                <div className="col-span-2 sm:col-span-3">
                  <Select name="exerciseId" value={ex.exerciseId} onChange={(e) => setExField(i, e)}
                    required placeholder={exLoading ? t('common.loading') : t('forms.program.selectExercise')} options={exercises} />
                </div>
                <Input name="sets"   type="number" min="1" max="100"   placeholder={t('forms.program.sets')} value={ex.sets}   onChange={(e) => setExField(i, e)} required />
                <Input name="reps"   type="number" min="1" max="10000" placeholder={t('forms.program.reps')} value={ex.reps}   onChange={(e) => setExField(i, e)} required />
                <Input name="weight" type="number" min="0" placeholder={t('enums.unit.KG')}                 value={ex.weight} onChange={(e) => setExField(i, e)} />
              </div>

              <button type="button" onClick={() => removeEx(i)}
                className="shrink-0 rounded-md p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors mt-0.5"
                disabled={form.exercises.length === 1}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-1 border-t border-gray-100">
        <Button type="button" variant="secondary" fullWidth onClick={onClose}>{t('common.cancel')}</Button>
        <Button type="submit" fullWidth loading={loading}>{initial ? t('common.saveChanges') : t('forms.program.create')}</Button>
      </div>
    </form>
  )
}
