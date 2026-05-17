import { useState } from 'react'
import { User, Lock, Trash2 } from 'lucide-react'
import { useAuth }     from '../hooks/useAuth'
import { useLanguage } from '../hooks/useLanguage'
import { authApi }     from '../api'
import { Input }       from '../components/common/Input'
import { Button }      from '../components/common/Button'
import { Alert }       from '../components/common/Alert'
import { Modal }       from '../components/common/Modal'

export function ProfilePage() {
  const { user, updateUser, deleteAccount } = useAuth()
  const { t } = useLanguage()

  const [firstName, setFirstName] = useState(user?.firstName ?? '')
  const [lastName,  setLastName]  = useState(user?.lastName  ?? '')
  const [infoLoading, setInfoLoading] = useState(false)
  const [infoError,   setInfoError]   = useState(null)
  const [infoSuccess, setInfoSuccess] = useState(false)

  const [currentPw, setCurrentPw] = useState('')
  const [newPw,     setNewPw]     = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError,   setPwError]   = useState(null)
  const [pwSuccess, setPwSuccess] = useState(false)

  const [showDelete,    setShowDelete]    = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError,   setDeleteError]   = useState(null)

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ')
  const initials = fullName
    ? fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : (user?.email?.[0] ?? 'U').toUpperCase()

  const handleSaveInfo = async (e) => {
    e.preventDefault()
    setInfoLoading(true)
    setInfoError(null)
    setInfoSuccess(false)
    try {
      const { data } = await authApi.updateProfile({ firstName, lastName })
      updateUser({ ...user, firstName: data.firstName, lastName: data.lastName })
      setInfoSuccess(true)
    } catch (err) {
      setInfoError(err.response?.data?.message ?? t('profile.failSave'))
    } finally {
      setInfoLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (newPw !== confirmPw) { setPwError(t('auth.passwordsNoMatch')); return }
    setPwLoading(true)
    setPwError(null)
    setPwSuccess(false)
    try {
      await authApi.updateProfile({
        firstName: user.firstName,
        lastName:  user.lastName,
        currentPassword: currentPw,
        newPassword:     newPw,
      })
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
      setPwSuccess(true)
    } catch (err) {
      setPwError(err.response?.data?.message ?? t('profile.failSave'))
    } finally {
      setPwLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleteLoading(true)
    setDeleteError(null)
    try {
      await deleteAccount()
    } catch (err) {
      setDeleteError(err.response?.data?.message ?? t('profile.failDelete'))
      setDeleteLoading(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">{t('profile.title')}</h2>
        <p className="text-sm text-gray-500 mt-0.5">{t('profile.subtitle')}</p>
      </div>

      {/* Avatar card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex items-center gap-5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white select-none">
          {initials}
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-900">{fullName || user?.email}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <span className="mt-1 inline-block rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
            {user?.role}
          </span>
        </div>
      </div>

      {/* Personal info */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <User size={16} className="text-gray-400" />
          <h3 className="font-semibold text-gray-900">{t('profile.personalInfo')}</h3>
        </div>
        <form onSubmit={handleSaveInfo} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="firstName"
              label={t('auth.firstName')}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Input
              id="lastName"
              label={t('auth.lastName')}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <Input
            id="email"
            label={t('auth.email')}
            value={user?.email ?? ''}
            disabled
            className="opacity-60 cursor-not-allowed"
          />
          <Alert message={infoError}   variant="error"   onClose={() => setInfoError(null)} />
          <Alert message={infoSuccess ? t('profile.saved') : null} variant="success" onClose={() => setInfoSuccess(false)} />
          <div className="flex justify-end">
            <Button type="submit" loading={infoLoading}>{t('common.saveChanges')}</Button>
          </div>
        </form>
      </div>

      {/* Change password */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Lock size={16} className="text-gray-400" />
          <h3 className="font-semibold text-gray-900">{t('profile.changePassword')}</h3>
        </div>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <Input
            id="currentPw"
            label={t('profile.currentPassword')}
            type="password"
            autoComplete="current-password"
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
            required
          />
          <Input
            id="newPw"
            label={t('profile.newPassword')}
            type="password"
            autoComplete="new-password"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            required
          />
          <Input
            id="confirmPw"
            label={t('profile.confirmNewPassword')}
            type="password"
            autoComplete="new-password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            required
          />
          <Alert message={pwError}   variant="error"   onClose={() => setPwError(null)} />
          <Alert message={pwSuccess ? t('profile.passwordChanged') : null} variant="success" onClose={() => setPwSuccess(false)} />
          <div className="flex justify-end">
            <Button type="submit" loading={pwLoading}>{t('profile.changePasswordBtn')}</Button>
          </div>
        </form>
      </div>

      {/* Danger zone */}
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-center gap-2 mb-2">
          <Trash2 size={16} className="text-red-500" />
          <h3 className="font-semibold text-red-700">{t('profile.dangerZone')}</h3>
        </div>
        <p className="text-sm text-red-600 mb-4">{t('profile.deleteWarning')}</p>
        <Button variant="danger" onClick={() => setShowDelete(true)}>
          {t('profile.deleteAccount')}
        </Button>
      </div>

      {/* Delete confirm modal */}
      <Modal
        open={showDelete}
        onClose={() => { setShowDelete(false); setDeleteError(null) }}
        title={t('profile.deleteConfirmTitle')}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">{t('profile.deleteConfirmMessage')}</p>
          <Alert message={deleteError} variant="error" onClose={() => setDeleteError(null)} />
          <div className="flex gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => { setShowDelete(false); setDeleteError(null) }}
              disabled={deleteLoading}
            >
              {t('common.cancel')}
            </Button>
            <Button variant="danger" fullWidth onClick={handleDelete} loading={deleteLoading}>
              {t('profile.deleteConfirmBtn')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
