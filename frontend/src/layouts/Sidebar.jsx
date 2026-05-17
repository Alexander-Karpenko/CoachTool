import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  ClipboardList,
  BarChart2,
  UserCircle,
  LogOut,
  X,
} from 'lucide-react'
import { Logo }         from '../components/ui/Logo'
import { useAuth }      from '../hooks/useAuth'
import { useLanguage }  from '../hooks/useLanguage'
import { ROUTES }       from '../utils/constants'

function UserAvatar({ firstName, lastName, email }) {
  const fullName = [firstName, lastName].filter(Boolean).join(' ')
  const initials = fullName
    ? fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : (email?.[0] ?? 'U').toUpperCase()

  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white">
        {initials}
      </div>
      <div className="min-w-0">
        {fullName && <p className="text-sm font-medium text-white truncate">{fullName}</p>}
        <p className="text-xs text-slate-400 truncate">{email}</p>
      </div>
    </div>
  )
}

export function Sidebar({ mobileOpen = false, onClose }) {
  const { logout, user } = useAuth()
  const { t } = useLanguage()

  const navItems = [
    { to: ROUTES.DASHBOARD,         icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: ROUTES.ATHLETES,          icon: Users,           label: t('nav.athletes')  },
    { to: ROUTES.EXERCISES,         icon: Dumbbell,        label: t('nav.exercises') },
    { to: ROUTES.TRAINING_PROGRAMS, icon: ClipboardList,   label: t('nav.programs')  },
    { to: ROUTES.ANALYTICS,         icon: BarChart2,       label: t('nav.analytics') },
    { to: ROUTES.PROFILE,           icon: UserCircle,      label: t('nav.profile')   },
  ]

  const sidebarContent = (
    <aside className="flex h-full w-64 flex-col bg-slate-900">
      {/* Logo + mobile close */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-slate-800">
        <Logo size="md" dark />
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden rounded-md p-1 text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">{t('nav.menu')}</p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === ROUTES.DASHBOARD}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-white' : 'text-slate-500'} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="border-t border-slate-800 px-3 py-3 space-y-1">
        <UserAvatar firstName={user?.firstName} lastName={user?.lastName} email={user?.email} />
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut size={16} />
          {t('nav.signOut')}
        </button>
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex h-screen">{sidebarContent}</div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="relative z-50 flex h-full">{sidebarContent}</div>
        </div>
      )}
    </>
  )
}
