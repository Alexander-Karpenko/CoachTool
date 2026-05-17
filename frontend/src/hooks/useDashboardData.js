import { useState, useEffect } from 'react'
import { athleteApi, exerciseApi, trainingProgramApi } from '../api'

const EMPTY = { stats: [], athletes: [], programs: [] }

export function useDashboardData() {
  const [loading, setLoading] = useState(true)
  const [data, setData]       = useState(EMPTY)

  useEffect(() => {
    let cancelled = false
    const fetchAll = async () => {
      try {
        const [{ data: athletes }, { data: exercises }, { data: programs }] =
          await Promise.all([
            athleteApi.getAll(),
            exerciseApi.getAll(),
            trainingProgramApi.getAll(),
          ])
        if (cancelled) return

        const totalPlanned = programs.reduce((sum, p) => sum + (p.exercises?.length ?? 0), 0)

        setData({
          stats: [
            { id: 'athletes',  label: 'Total Athletes',    value: athletes.length,  icon: 'users'     },
            { id: 'programs',  label: 'Training Programs', value: programs.length,  icon: 'clipboard' },
            { id: 'exercises', label: 'Exercise Library',  value: exercises.length, icon: 'dumbbell'  },
            { id: 'planned',   label: 'Exercises Planned', value: totalPlanned,     icon: 'calendar'  },
          ],
          athletes: athletes.slice(0, 5),
          programs: programs.slice(0, 5),
        })
      } catch (_) {
        // keep empty state — individual pages show their own error messages
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchAll()
    return () => { cancelled = true }
  }, [])

  return { loading, data }
}
