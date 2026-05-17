import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { ROUTES } from '../utils/constants'

export function NotFoundPage() {
  const { t } = useLanguage()
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-center px-4">
      <p className="text-8xl font-black text-indigo-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">{t('notFound.title')}</h1>
      <p className="mt-2 text-sm text-gray-500">{t('notFound.description')}</p>
      <Link
        to={ROUTES.DASHBOARD}
        className="mt-6 inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
      >
        {t('notFound.backToDashboard')}
      </Link>
    </div>
  )
}
