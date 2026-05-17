export const ROUTES = {
  LOGIN:             '/login',
  REGISTER:          '/register',
  DASHBOARD:         '/',
  ATHLETES:          '/athletes',
  ATHLETE_PROFILE:   '/athletes/:id',
  EXERCISES:         '/exercises',
  TRAINING_PROGRAMS: '/training-programs',
  ANALYTICS:         '/analytics',
  PROFILE:           '/profile',
}

export const athleteProfilePath = (id) => `/athletes/${id}`
