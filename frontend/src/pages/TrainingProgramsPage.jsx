import { useState, useEffect, useCallback } from 'react'
import { ClipboardList, Plus, Pencil, Trash2 } from 'lucide-react'
import { trainingProgramApi, athleteApi } from '../api'
import { useLanguage }          from '../hooks/useLanguage'
import { ProgramForm }          from '../components/programs/ProgramForm'
import { WeeklyProgramView }    from '../components/programs/WeeklyProgramView'
import { Modal }                from '../components/common/Modal'
import { ConfirmDialog }        from '../components/common/ConfirmDialog'
import { Button }               from '../components/common/Button'
import { Badge }                from '../components/common/Badge'
import { Skeleton }             from '../components/common/Skeleton'
import { EmptyState }           from '../components/common/EmptyState'
import { Alert }                from '../components/common/Alert'

function SkeletonRow() {
  return (
    <tr>
      {[180, 140, 100, 60, 60].map((w, i) => (
        <td key={i} className="px-4 py-3"><Skeleton className="h-4" style={{ width: w }} /></td>
      ))}
    </tr>
  )
}

export function TrainingProgramsPage() {
  const { t } = useLanguage()
  const [programs,  setPrograms]  = useState([])
  const [athletes,  setAthletes]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [pageError, setPageError] = useState(null)

  // Edit form
  const [formOpen,    setFormOpen]    = useState(false)
  const [editing,     setEditing]     = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formError,   setFormError]   = useState(null)

  // Delete
  const [delTarget,  setDelTarget]  = useState(null)
  const [delLoading, setDelLoading] = useState(false)

  // Weekly view
  const [weeklyProgram,     setWeeklyProgram]     = useState(null)
  const [weeklyOpen,        setWeeklyOpen]        = useState(false)
  const [weeklySaveLoading, setWeeklySaveLoading] = useState(false)
  const [weeklyCopyLoading, setWeeklyCopyLoading] = useState(false)
  const [weeklyError,       setWeeklyError]       = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setPageError(null)
    try {
      const [{ data: progs }, { data: aths }] = await Promise.all([
        trainingProgramApi.getAll(),
        athleteApi.getAll(),
      ])
      setPrograms(progs)
      setAthletes(aths)
    } catch (e) {
      setPageError(e.response?.data?.message ?? t('programs.failLoad'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => { load() }, [load])

  // — Form (create / edit) —
  const openAdd  = ()  => { setEditing(null); setFormError(null); setFormOpen(true) }
  const openEdit = (p) => { setEditing(p);    setFormError(null); setFormOpen(true) }
  const closeForm = () => { setFormOpen(false); setEditing(null) }

  const handleSubmit = async (payload) => {
    setFormLoading(true)
    setFormError(null)
    try {
      if (editing) {
        const { data } = await trainingProgramApi.update(editing.id, payload)
        setPrograms(prev => prev.map(p => p.id === editing.id ? data : p))
      } else {
        const { data } = await trainingProgramApi.create(payload)
        setPrograms(prev => [data, ...prev])
      }
      closeForm()
    } catch (e) {
      setFormError(e.response?.data?.message ?? t('programs.failSave'))
    } finally {
      setFormLoading(false)
    }
  }

  // — Delete —
  const handleDelete = async () => {
    setDelLoading(true)
    try {
      await trainingProgramApi.remove(delTarget.id)
      setPrograms(prev => prev.filter(p => p.id !== delTarget.id))
      setDelTarget(null)
    } catch (e) {
      setPageError(e.response?.data?.message ?? t('programs.failDelete'))
      setDelTarget(null)
    } finally {
      setDelLoading(false)
    }
  }

  // — Weekly view —
  const openWeekly = (p) => { setWeeklyProgram(p); setWeeklyError(null); setWeeklyOpen(true) }
  const closeWeekly = ()  => { setWeeklyOpen(false); setWeeklyProgram(null) }

  const handleWeeklySave = async (exercises) => {
    setWeeklySaveLoading(true)
    setWeeklyError(null)
    try {
      const { data } = await trainingProgramApi.update(weeklyProgram.id, {
        title:         weeklyProgram.title,
        athleteId:     weeklyProgram.athleteId,
        weekStartDate: weeklyProgram.weekStartDate,
        notes:         weeklyProgram.notes,
        exercises,
      })
      setPrograms(prev => prev.map(p => p.id === weeklyProgram.id ? data : p))
      setWeeklyProgram(data)
    } catch (e) {
      setWeeklyError(e.response?.data?.message ?? t('programs.failSave'))
    } finally {
      setWeeklySaveLoading(false)
    }
  }

  const handleCopyNextWeek = async () => {
    setWeeklyCopyLoading(true)
    setWeeklyError(null)
    try {
      const { data } = await trainingProgramApi.copyToNextWeek(weeklyProgram.id)
      setPrograms(prev => [data, ...prev])
    } catch (e) {
      setWeeklyError(e.response?.data?.message ?? t('programs.failCopy'))
    } finally {
      setWeeklyCopyLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{t('programs.title')}</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {!loading && t('programs.total', { n: programs.length })}
          </p>
        </div>
        <Button onClick={openAdd}><Plus size={16} className="mr-1" />{t('programs.newProgram')}</Button>
      </div>

      <Alert message={pageError} onClose={() => setPageError(null)} />

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('programs.tableProgram')}</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('programs.tableAthlete')}</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('programs.tableWeekStart')}</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('programs.tableExercises')}</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('programs.tableCreated')}</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                : programs.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => openWeekly(p)}
                            title={t('programs.viewSchedule')}
                            className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 hover:bg-indigo-100 transition-colors"
                          >
                            <ClipboardList size={15} className="text-indigo-600" />
                          </button>
                          <div>
                            <p className="font-medium text-gray-900">{p.title}</p>
                            {p.notes && <p className="text-xs text-gray-400 truncate max-w-[200px]">{p.notes}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{p.athleteFirstName} {p.athleteLastName}</td>
                      <td className="px-4 py-3 text-gray-500">{p.weekStartDate ?? '—'}</td>
                      <td className="px-4 py-3">
                        <Badge label={t('programs.exercisesCount', { n: p.exercises?.length ?? 0 })} variant="indigo" />
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString(t('dashboard.dateLocale')) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            onClick={() => openEdit(p)}
                            className="rounded-lg p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title={t('programs.editProgram')}
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setDelTarget(p)}
                            className="rounded-lg p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>

          {!loading && programs.length === 0 && (
            <EmptyState
              icon={ClipboardList}
              title={t('programs.noProgramsYet')}
              description={t('programs.noProgramsDesc')}
              action={<Button onClick={openAdd}><Plus size={15} className="mr-1" />{t('programs.newProgram')}</Button>}
            />
          )}
        </div>
      </div>

      {/* Edit / create form */}
      <Modal open={formOpen} onClose={closeForm} title={editing ? t('programs.editProgram') : t('programs.newTrainingProgram')} size="lg">
        <ProgramForm
          initial={editing}
          athletes={athletes}
          onSubmit={handleSubmit}
          onClose={closeForm}
          loading={formLoading}
          error={formError}
        />
      </Modal>

      {/* Weekly schedule view */}
      <WeeklyProgramView
        program={weeklyProgram}
        open={weeklyOpen}
        onClose={closeWeekly}
        onSave={handleWeeklySave}
        onCopyNextWeek={handleCopyNextWeek}
        saveLoading={weeklySaveLoading}
        copyLoading={weeklyCopyLoading}
        error={weeklyError}
      />

      <ConfirmDialog
        open={!!delTarget}
        onClose={() => setDelTarget(null)}
        onConfirm={handleDelete}
        loading={delLoading}
        title={t('programs.deleteTitle', { name: delTarget?.title ?? '' })}
        message={t('programs.deleteMessage')}
      />
    </div>
  )
}
