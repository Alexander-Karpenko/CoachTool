import { useState, useEffect, useCallback } from 'react'
import { Dumbbell, Plus, Pencil, Trash2, Search } from 'lucide-react'
import { exerciseApi }    from '../api'
import { useLanguage }    from '../hooks/useLanguage'
import { ExerciseForm }   from '../components/exercises/ExerciseForm'
import { Modal }          from '../components/common/Modal'
import { ConfirmDialog }  from '../components/common/ConfirmDialog'
import { Button }         from '../components/common/Button'
import { Badge }          from '../components/common/Badge'
import { Skeleton }       from '../components/common/Skeleton'
import { EmptyState }     from '../components/common/EmptyState'
import { Alert }          from '../components/common/Alert'
import { Select }         from '../components/common/Select'
import { muscleBadge, typeBadge, translatedMuscleGroups, translatedExerciseTypes, translatedLoadUnits } from '../utils/enums'

function ExerciseCard({ exercise, onEdit, onDelete, t }) {
  const mb   = muscleBadge(exercise.muscleGroup, t)
  const tb   = typeBadge(exercise.exerciseType, t)
  const unit = translatedLoadUnits(t).find((u) => u.value === exercise.loadUnit)?.label ?? exercise.loadUnit

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => onEdit(exercise)}
            className="h-9 w-9 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 hover:bg-indigo-100 transition-colors"
            title={t('exercises.editExercise')}
          >
            <Dumbbell size={17} className="text-indigo-600" />
          </button>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{exercise.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{unit}</p>
          </div>
        </div>
        <div className="flex gap-1 shrink-0">
          <button onClick={() => onEdit(exercise)} className="rounded-md p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
            <Pencil size={14} />
          </button>
          <button onClick={() => onDelete(exercise)} className="rounded-md p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="flex gap-2 mt-3 flex-wrap">
        <Badge label={mb.label} variant={mb.variant} />
        <Badge label={tb.label} variant={tb.variant} />
      </div>

      {exercise.description && (
        <p className="mt-2 text-xs text-gray-500 line-clamp-2">{exercise.description}</p>
      )}
    </div>
  )
}

function CardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2.5 mb-3">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
  )
}

export function ExercisesPage() {
  const { t } = useLanguage()
  const [exercises, setExercises] = useState([])
  const [loading, setLoading]     = useState(true)
  const [pageError, setPageError] = useState(null)
  const [search, setSearch]       = useState('')
  const [filterMuscle, setFilterMuscle] = useState('')
  const [filterType,   setFilterType]   = useState('')
  const [formOpen, setFormOpen]   = useState(false)
  const [editing, setEditing]     = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formError,   setFormError]   = useState(null)
  const [delTarget,   setDelTarget]   = useState(null)
  const [delLoading,  setDelLoading]  = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setPageError(null)
    try {
      const params = {}
      if (filterMuscle) params.muscleGroup  = filterMuscle
      if (filterType)   params.exerciseType = filterType
      const { data } = await exerciseApi.getAll(params)
      setExercises(data)
    } catch (e) {
      setPageError(e.response?.data?.message ?? t('exercises.failLoad'))
    } finally {
      setLoading(false)
    }
  }, [filterMuscle, filterType, t])

  useEffect(() => { load() }, [load])

  const visible = exercises.filter((e) =>
    !search || e.name.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd  = ()  => { setEditing(null); setFormError(null); setFormOpen(true) }
  const openEdit = (e) => { setEditing(e);    setFormError(null); setFormOpen(true) }
  const closeForm = () => { setFormOpen(false); setEditing(null) }

  const handleSubmit = async (payload) => {
    setFormLoading(true)
    setFormError(null)
    try {
      if (editing) {
        const { data } = await exerciseApi.update(editing.id, payload)
        setExercises((prev) => prev.map((ex) => ex.id === editing.id ? data : ex))
      } else {
        const { data } = await exerciseApi.create(payload)
        setExercises((prev) => [...prev, data])
      }
      closeForm()
    } catch (e) {
      setFormError(e.response?.data?.message ?? t('exercises.failSave'))
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    setDelLoading(true)
    try {
      await exerciseApi.remove(delTarget.id)
      setExercises((prev) => prev.filter((ex) => ex.id !== delTarget.id))
      setDelTarget(null)
    } catch (e) {
      setPageError(e.response?.data?.message ?? t('exercises.failDelete'))
      setDelTarget(null)
    } finally {
      setDelLoading(false)
    }
  }

  const allOption      = [{ value: '', label: t('common.all') }]
  const muscleOptions  = [...allOption, ...translatedMuscleGroups(t)]
  const typeOptions    = [...allOption, ...translatedExerciseTypes(t)]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{t('exercises.title')}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{!loading && t('exercises.count', { n: exercises.length })}</p>
        </div>
        <Button onClick={openAdd}><Plus size={16} className="mr-1" />{t('exercises.addExercise')}</Button>
      </div>

      <Alert message={pageError} onClose={() => setPageError(null)} />

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={t('exercises.searchPlaceholder')} value={search} onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filterMuscle} onChange={(e) => setFilterMuscle(e.target.value)}
          options={muscleOptions} className="w-44" />
        <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}
          options={typeOptions} className="w-40" />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : visible.length === 0 ? (
        <EmptyState icon={Dumbbell} title={t('exercises.noFound')} description={t('exercises.noFoundDesc')}
          action={<Button onClick={openAdd}><Plus size={15} className="mr-1" />{t('exercises.addExercise')}</Button>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visible.map((ex) => (
            <ExerciseCard key={ex.id} exercise={ex} onEdit={openEdit} onDelete={setDelTarget} t={t} />
          ))}
        </div>
      )}

      <Modal open={formOpen} onClose={closeForm} title={editing ? t('exercises.editExercise') : t('exercises.addExercise')}>
        <ExerciseForm initial={editing} onSubmit={handleSubmit} onClose={closeForm} loading={formLoading} error={formError} />
      </Modal>

      <ConfirmDialog
        open={!!delTarget} onClose={() => setDelTarget(null)} onConfirm={handleDelete} loading={delLoading}
        title={t('exercises.deleteTitle', { name: delTarget?.name ?? '' })}
        message={t('exercises.deleteMessage')}
      />
    </div>
  )
}
