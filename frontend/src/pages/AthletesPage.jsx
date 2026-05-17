import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { UserPlus, Pencil, Trash2, Users } from 'lucide-react'
import { athleteApi }      from '../api'
import { useLanguage }     from '../hooks/useLanguage'
import { AthleteForm }     from '../components/athletes/AthleteForm'
import { Modal }           from '../components/common/Modal'
import { ConfirmDialog }   from '../components/common/ConfirmDialog'
import { Button }          from '../components/common/Button'
import { Badge }           from '../components/common/Badge'
import { Skeleton }        from '../components/common/Skeleton'
import { EmptyState }      from '../components/common/EmptyState'
import { Alert }           from '../components/common/Alert'
import { qualBadge }           from '../utils/enums'
import { athleteProfilePath }  from '../utils/constants'

const AVATAR_COLORS = ['bg-blue-500','bg-emerald-500','bg-purple-500','bg-orange-500','bg-rose-500','bg-teal-500','bg-indigo-500','bg-amber-500']
const avatarColor = (name) => AVATAR_COLORS[name.split('').reduce((a,c) => a + c.charCodeAt(0), 0) % AVATAR_COLORS.length]
const initials    = (a)    => `${a.firstName[0]}${a.lastName[0]}`.toUpperCase()

function SkeletonRow() {
  return (
    <tr>
      {[140, 60, 120, 80, 100, 80].map((w, i) => (
        <td key={i} className="px-4 py-3"><Skeleton className={`h-4 w-${w === 80 ? '20' : ''}`} style={{ width: w }} /></td>
      ))}
    </tr>
  )
}

export function AthletesPage() {
  const { t } = useLanguage()
  const [athletes, setAthletes]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [pageError, setPageError] = useState(null)
  const [formOpen, setFormOpen]   = useState(false)
  const [editing, setEditing]     = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState(null)
  const [delTarget, setDelTarget] = useState(null)
  const [delLoading, setDelLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setPageError(null)
    try {
      const { data } = await athleteApi.getAll()
      setAthletes(data)
    } catch (e) {
      setPageError(e.response?.data?.message ?? t('athletes.failLoad'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => { load() }, [load])

  const openAdd  = ()  => { setEditing(null); setFormError(null); setFormOpen(true) }
  const openEdit = (a) => { setEditing(a);    setFormError(null); setFormOpen(true) }
  const closeForm = () => { setFormOpen(false); setEditing(null) }

  const handleSubmit = async (payload) => {
    setFormLoading(true)
    setFormError(null)
    try {
      if (editing) {
        const { data } = await athleteApi.update(editing.id, payload)
        setAthletes((prev) => prev.map((a) => a.id === editing.id ? data : a))
      } else {
        const { data } = await athleteApi.create(payload)
        setAthletes((prev) => [...prev, data])
      }
      closeForm()
    } catch (e) {
      setFormError(e.response?.data?.message ?? t('athletes.failSave'))
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    setDelLoading(true)
    try {
      await athleteApi.remove(delTarget.id)
      setAthletes((prev) => prev.filter((a) => a.id !== delTarget.id))
      setDelTarget(null)
    } catch (e) {
      setPageError(e.response?.data?.message ?? t('athletes.failDelete'))
      setDelTarget(null)
    } finally {
      setDelLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{t('athletes.title')}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{!loading && t('athletes.registered', { n: athletes.length })}</p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <UserPlus size={16} /> {t('athletes.addAthlete')}
        </Button>
      </div>

      <Alert message={pageError} onClose={() => setPageError(null)} />

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('athletes.tableAthlete')}</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('athletes.tableAge')}</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('athletes.tableQualification')}</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('athletes.tableWeight')}</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('athletes.tableHeight')}</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('athletes.tableTrainingSince')}</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                : athletes.map((a) => {
                    const qb = qualBadge(a.qualification, t)
                    return (
                      <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => openEdit(a)}
                              className={`h-8 w-8 rounded-full ${avatarColor(a.firstName + a.lastName)} flex items-center justify-center text-white text-xs font-bold shrink-0 hover:ring-2 hover:ring-offset-1 hover:ring-indigo-400 transition-all`}
                              title={t('athletes.editAthlete')}
                            >
                              {initials(a)}
                            </button>
                            <div>
                              <Link
                                to={athleteProfilePath(a.id)}
                                className="font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                              >
                                {a.firstName} {a.lastName}
                              </Link>
                              {a.contactInfo && <p className="text-xs text-gray-400 truncate max-w-[160px]">{a.contactInfo}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{a.age}</td>
                        <td className="px-4 py-3">
                          {a.qualification
                            ? <Badge label={qb.label} variant={qb.variant} />
                            : <span className="text-gray-400">—</span>}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{a.weight ? `${a.weight} ${t('enums.unit.KG')}` : '—'}</td>
                        <td className="px-4 py-3 text-gray-600">{a.height ? `${a.height} cm` : '—'}</td>
                        <td className="px-4 py-3 text-gray-500">{a.trainingStartDate ?? '—'}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button onClick={() => openEdit(a)} className="rounded-lg p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                              <Pencil size={15} />
                            </button>
                            <button onClick={() => setDelTarget(a)} className="rounded-lg p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
              }
            </tbody>
          </table>

          {!loading && athletes.length === 0 && (
            <EmptyState icon={Users} title={t('athletes.noAthletesYet')} description={t('athletes.addFirstAthlete')}
              action={<Button onClick={openAdd}><UserPlus size={15} className="mr-1.5" />{t('athletes.addAthlete')}</Button>} />
          )}
        </div>
      </div>

      {/* Add / Edit modal */}
      <Modal open={formOpen} onClose={closeForm} title={editing ? t('athletes.editAthlete') : t('athletes.addAthlete')} size="md">
        <AthleteForm initial={editing} onSubmit={handleSubmit} onClose={closeForm} loading={formLoading} error={formError} />
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!delTarget} onClose={() => setDelTarget(null)} onConfirm={handleDelete} loading={delLoading}
        title={t('athletes.deleteTitle', { name: `${delTarget?.firstName} ${delTarget?.lastName}` })}
        message={t('athletes.deleteMessage')}
      />
    </div>
  )
}
