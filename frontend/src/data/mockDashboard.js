export const mockStats = [
  { id: 'athletes',  label: 'Total Athletes',     value: 12, change: 2,  changeType: 'increase', icon: 'users'     },
  { id: 'programs',  label: 'Active Programs',    value: 8,  change: 1,  changeType: 'increase', icon: 'clipboard' },
  { id: 'exercises', label: 'Exercise Library',   value: 45, change: 5,  changeType: 'increase', icon: 'dumbbell'  },
  { id: 'sessions',  label: 'Sessions This Week', value: 24, change: 3,  changeType: 'decrease', icon: 'calendar'  },
]

export const mockAthletes = [
  { id: 1, name: 'Alexei Petrov',   sport: 'Powerlifting',  qualification: 'Master of Sports', lastSession: '2026-05-16', active: true  },
  { id: 2, name: 'Maria Sokolova',  sport: 'Weightlifting', qualification: 'Candidate Master',  lastSession: '2026-05-15', active: true  },
  { id: 3, name: 'Denis Volkov',    sport: 'CrossFit',      qualification: 'First Class',       lastSession: '2026-05-14', active: true  },
  { id: 4, name: 'Elena Novikova',  sport: 'Powerlifting',  qualification: 'Second Class',      lastSession: '2026-05-10', active: false },
  { id: 5, name: 'Igor Kovalev',    sport: 'Strongman',     qualification: 'Master of Sports',  lastSession: '2026-05-17', active: true  },
]

export const mockPrograms = [
  { id: 1, name: 'Strength Base — Week 1', athlete: 'Alexei Petrov',   exercises: 6, weekStart: '2026-05-12', completed: false },
  { id: 2, name: 'Olympic Prep — Week 3',  athlete: 'Maria Sokolova',  exercises: 8, weekStart: '2026-05-12', completed: false },
  { id: 3, name: 'Hypertrophy Block',      athlete: 'Denis Volkov',    exercises: 5, weekStart: '2026-05-05', completed: true  },
  { id: 4, name: 'Recovery Week',          athlete: 'Elena Novikova',  exercises: 4, weekStart: '2026-05-05', completed: true  },
  { id: 5, name: 'Max Strength — Week 2',  athlete: 'Igor Kovalev',    exercises: 7, weekStart: '2026-05-12', completed: false },
]

export const mockWeeklyVolume = [
  { day: 'Mon', volume: 8400  },
  { day: 'Tue', volume: 12200 },
  { day: 'Wed', volume: 6800  },
  { day: 'Thu', volume: 15600 },
  { day: 'Fri', volume: 11000 },
  { day: 'Sat', volume: 4200  },
  { day: 'Sun', volume: 0     },
]
