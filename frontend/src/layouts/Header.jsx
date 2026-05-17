import { Bell, Menu, Search } from 'lucide-react'
import { useAuth }     from '../hooks/useAuth'
import { useLanguage } from '../hooks/useLanguage'

export function Header({ title, onMenuClick }) {
  const { user }       = useAuth()
  const { lang, setLang, t } = useLanguage()

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ')
  const initials = fullName
    ? fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : (user?.email?.[0] ?? 'U').toUpperCase()

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuClick}
          className="lg:hidden rounded-md p-2 text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label={t('header.openMenu')}
        >
          <Menu size={20} />
        </button>
        <h1 className="text-base font-semibold text-gray-900 sm:text-lg">{title}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-400 w-52 focus-within:border-indigo-300 focus-within:bg-white focus-within:text-gray-600 transition-colors">
          <Search size={15} />
          <input
            className="bg-transparent outline-none placeholder-gray-400 text-gray-700 text-sm w-full"
            placeholder={t('header.search')}
          />
        </div>

        {/* Language toggle */}
        <button
          onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}
          className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          title={lang === 'ru' ? 'Switch to English' : 'Переключить на русский'}
        >
          {lang === 'ru' ? 'EN' : 'RU'}
        </button>

        {/* Notifications */}
        <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
            {initials}
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:block truncate max-w-[120px]">
            {fullName || user?.email}
          </span>
        </div>
      </div>
    </header>
  )
}
