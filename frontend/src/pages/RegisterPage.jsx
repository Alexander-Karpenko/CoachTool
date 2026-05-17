import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth }     from '../hooks/useAuth'
import { useLanguage } from '../hooks/useLanguage'
import { Input }   from '../components/common/Input'
import { Button }  from '../components/common/Button'
import { Alert }   from '../components/common/Alert'
import { ROUTES }  from '../utils/constants'

export function RegisterPage() {
  const { register, loading, error, clearError } = useAuth()
  const { t } = useLanguage()
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
  })
  const [formError, setFormError] = useState('')

  const onChange = (e) => {
    clearError()
    setFormError('')
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setFormError(t('auth.passwordsNoMatch'))
      return
    }
    const { confirmPassword, ...payload } = form
    try { await register(payload) } catch { /* handled in context */ }
  }

  return (
    <>
      <h2 className="mb-1 text-2xl font-bold text-gray-900">{t('auth.createAccount')}</h2>
      <p className="mb-6 text-sm text-gray-500">{t('auth.registerSubtitle')}</p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Alert message={formError || error} onClose={() => { setFormError(''); clearError() }} />

        <div className="grid grid-cols-2 gap-3">
          <Input
            id="firstName"
            name="firstName"
            type="text"
            label={t('auth.firstName')}
            placeholder="John"
            value={form.firstName}
            onChange={onChange}
            required
            autoComplete="given-name"
          />
          <Input
            id="lastName"
            name="lastName"
            type="text"
            label={t('auth.lastName')}
            placeholder="Coach"
            value={form.lastName}
            onChange={onChange}
            required
            autoComplete="family-name"
          />
        </div>

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
          minLength={8}
          autoComplete="new-password"
        />

        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label={t('auth.confirmPassword')}
          placeholder="••••••••"
          value={form.confirmPassword}
          onChange={onChange}
          required
          autoComplete="new-password"
        />

        <Button type="submit" loading={loading} fullWidth className="mt-2">
          {t('auth.createAccount')}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        {t('auth.alreadyHaveAccount')}{' '}
        <Link to={ROUTES.LOGIN} className="font-medium text-indigo-600 hover:text-indigo-500">
          {t('auth.signIn')}
        </Link>
      </p>
    </>
  )
}
