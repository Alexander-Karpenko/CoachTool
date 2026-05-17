import { useState } from 'react'
import { Input }     from '../common/Input'
import { Select }    from '../common/Select'
import { Textarea }  from '../common/Textarea'
import { Button }    from '../common/Button'
import { Alert }     from '../common/Alert'
import { useLanguage }             from '../../hooks/useLanguage'
import { translatedQualifications } from '../../utils/enums'

const blank = { firstName: '', lastName: '', age: '', height: '', weight: '', qualification: '', trainingStartDate: '', contactInfo: '' }

export function AthleteForm({ initial, onSubmit, onClose, loading, error }) {
  const { t } = useLanguage()
  const [form, setForm] = useState(
    initial
      ? { ...initial, age: initial.age ?? '', height: initial.height ?? '', weight: initial.weight ?? '', qualification: initial.qualification ?? '', trainingStartDate: initial.trainingStartDate ?? '' }
      : blank
  )

  const set = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    onSubmit({
      firstName:         form.firstName,
      lastName:          form.lastName,
      age:               form.age        ? Number(form.age)    : null,
      height:            form.height     ? Number(form.height) : null,
      weight:            form.weight     ? Number(form.weight) : null,
      qualification:     form.qualification || null,
      trainingStartDate: form.trainingStartDate || null,
      contactInfo:       form.contactInfo || null,
    })
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Alert message={error} />

      <div className="grid grid-cols-2 gap-3">
        <Input id="firstName" name="firstName" label={t('forms.athlete.firstName')} value={form.firstName} onChange={set} required />
        <Input id="lastName"  name="lastName"  label={t('forms.athlete.lastName')}  value={form.lastName}  onChange={set} required />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Input id="age"    name="age"    label={t('forms.athlete.age')}    type="number" min="0" max="120" value={form.age}    onChange={set} required />
        <Input id="height" name="height" label={t('forms.athlete.height')} type="number" min="0"          value={form.height} onChange={set} />
        <Input id="weight" name="weight" label={t('forms.athlete.weight')} type="number" min="0"          value={form.weight} onChange={set} />
      </div>

      <Select
        id="qualification" name="qualification" label={t('forms.athlete.qualification')}
        value={form.qualification} onChange={set}
        placeholder={t('forms.athlete.selectQualification')} options={translatedQualifications(t)}
      />

      <Input
        id="trainingStartDate" name="trainingStartDate" label={t('forms.athlete.trainingStartDate')}
        type="date" value={form.trainingStartDate} onChange={set}
      />

      <Textarea
        id="contactInfo" name="contactInfo" label={t('forms.athlete.contactInfo')}
        placeholder={t('forms.athlete.contactPlaceholder')} value={form.contactInfo} onChange={set} rows={2}
      />

      <div className="flex gap-3 pt-1">
        <Button type="button" variant="secondary" fullWidth onClick={onClose}>{t('common.cancel')}</Button>
        <Button type="submit" fullWidth loading={loading}>{initial ? t('common.saveChanges') : t('forms.athlete.add')}</Button>
      </div>
    </form>
  )
}
