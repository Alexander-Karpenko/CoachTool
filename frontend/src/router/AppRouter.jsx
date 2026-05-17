import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthLayout }            from '../layouts/AuthLayout'
import { DashboardLayout }       from '../layouts/DashboardLayout'
import { ProtectedRoute }        from './ProtectedRoute'
import { LoginPage }             from '../pages/LoginPage'
import { RegisterPage }          from '../pages/RegisterPage'
import { DashboardPage }         from '../pages/DashboardPage'
import { AthletesPage }          from '../pages/AthletesPage'
import { ExercisesPage }         from '../pages/ExercisesPage'
import { TrainingProgramsPage }  from '../pages/TrainingProgramsPage'
import { AnalyticsPage }         from '../pages/AnalyticsPage'
import { ProfilePage }           from '../pages/ProfilePage'
import { NotFoundPage }          from '../pages/NotFoundPage'
import { ROUTES }                from '../utils/constants'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN}    element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path={ROUTES.DASHBOARD}         element={<DashboardPage />} />
          <Route path={ROUTES.ATHLETES}          element={<AthletesPage />} />
          <Route path={ROUTES.EXERCISES}         element={<ExercisesPage />} />
          <Route path={ROUTES.TRAINING_PROGRAMS} element={<TrainingProgramsPage />} />
          <Route path={ROUTES.ANALYTICS}         element={<AnalyticsPage />} />
          <Route path={ROUTES.PROFILE}           element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*"    element={<Navigate to="/404" replace />} />
    </Routes>
  )
}
