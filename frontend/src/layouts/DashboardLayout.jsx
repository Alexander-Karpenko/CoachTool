import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar }     from './Sidebar'
import { Header }      from './Header'
import { useLanguage } from '../hooks/useLanguage'
import { ROUTES }      from '../utils/constants'

export function DashboardLayout() {
  const { pathname }          = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { t } = useLanguage()

  const pageTitles = {
    [ROUTES.DASHBOARD]:         t('nav.dashboard'),
    [ROUTES.ATHLETES]:          t('nav.athletes'),
    [ROUTES.EXERCISES]:         t('nav.exercises'),
    [ROUTES.TRAINING_PROGRAMS]: t('nav.programs'),
    [ROUTES.ANALYTICS]:         t('nav.analytics'),
  }

  const title = pageTitles[pathname] ?? 'CoachTool'

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Header
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
