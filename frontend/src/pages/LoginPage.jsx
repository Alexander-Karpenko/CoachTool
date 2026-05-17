import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth }     from '../hooks/useAuth'
import { useLanguage } from '../hooks/useLanguage'
import { Input }   from '../components/common/Input'
import { Button }  from '../components/common/Button'
import { Alert }   from '../components/common/Alert'
import { ROUTES }  from '../utils/constants'

export function LoginPage() {
  const { login, loading, error, clearError } = useAuth()
  const { t } = useLanguage()
  const [form, setForm] = useState({ email: '', password: '' })

  const onChange = (e) => {
    clearError()
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try { await login(form) } catch { /* handled in context */ }
  }

  return (
    <>
      <h2 className="mb-1 text-2xl font-bold text-gray-900">{t('auth.welcomeBack')}</h2>
      <p className="mb-6 text-sm text-gray-500">{t('auth.signInSubtitle')}</p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Alert message={error} onClose={clearError} />

        <Input
          id="email"
          name="email"
          type="email"
          label={t('auth.email')}
          placeholder="coach@example.com"
          value={form.email}
          onChange={onChange}
          required
          autoComplete="email"
        />

        <Input
          id="password"
          name="password"
          type="password"
          label={t('auth.password')}
          placeholder="••••••••"
          value={form.password}
          onChange={onChange}
          required
          autoComplete="current-password"
        />

        <Button type="submit" loading={loading} fullWidth className="mt-2">
          {t('auth.signIn')}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        {t('auth.noAccount')}{' '}
        <Link to={ROUTES.REGISTER} className="font-medium text-indigo-600 hover:text-indigo-500">
          {t('auth.createOne')}
        </Link>
      </p>
    </>
  )
}
