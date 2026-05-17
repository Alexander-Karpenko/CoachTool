import { useState } from 'react'
import { Input }    from '../common/Input'
import { Select }   from '../common/Select'
import { Textarea } from '../common/Textarea'
import { Button }   from '../common/Button'
import { Alert }    from '../common/Alert'
import { useLanguage }                                                           from '../../hooks/useLanguage'
import { translatedMuscleGroups, translatedExerciseTypes, translatedLoadUnits } from '../../utils/enums'

const blank = { name: '', muscleGroup: '', exerciseType: '', loadUnit: '', description: '' }

export function ExerciseForm({ initial, onSubmit, onClose, loading, error }) {
  const { t } = useLanguage()
  const [form, setForm] = useState(initial ?? blank)
  const set = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    onSubmit({ ...form, description: form.description || null })
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Alert message={error} />

      <Input id="name" name="name" label={t('forms.exercise.name')} placeholder={t('forms.exercise.namePlaceholder')}
        value={form.name} onChange={set} required />

      <div className="grid grid-cols-2 gap-3">
        <Select id="muscleGroup" name="muscleGroup" label={t('forms.exercise.muscleGroup')}
          value={form.muscleGroup} onChange={set} required
          placeholder={t('forms.exercise.selectMuscleGroup')} options={translatedMuscleGroups(t)} />
        <Select id="exerciseType" name="exerciseType" label={t('forms.exercise.exerciseType')}
          value={form.exerciseType} onChange={set} required
          placeholder={t('forms.exercise.selectType')} options={translatedExerciseTypes(t)} />
      </div>

      <Select id="loadUnit" name="loadUnit" label={t('forms.exercise.loadUnit')}
        value={form.loadUnit} onChange={set} required
        placeholder={t('forms.exercise.selectUnit')} options={translatedLoadUnits(t)} />

      <Textarea id="description" name="description" label={t('forms.exercise.description')}
        placeholder={t('forms.exercise.descPlaceholder')} value={form.description} onChange={set} rows={3} />

      <div className="flex gap-3 pt-1">
        <Button type="button" variant="secondary" fullWidth onClick={onClose}>{t('common.cancel')}</Button>
        <Button type="submit" fullWidth loading={loading}>{initial ? t('common.saveChanges') : t('forms.exercise.add')}</Button>
      </div>
    </form>
  )
}
