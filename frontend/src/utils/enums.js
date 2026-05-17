export const QUALIFICATIONS = [
  { value: 'BEGINNER',                       label: 'Beginner' },
  { value: 'INTERMEDIATE',                   label: 'Intermediate' },
  { value: 'ADVANCED',                       label: 'Advanced' },
  { value: 'CANDIDATE_MASTER_OF_SPORT',      label: 'Candidate Master of Sport' },
  { value: 'MASTER_OF_SPORT',                label: 'Master of Sport' },
  { value: 'INTERNATIONAL_MASTER_OF_SPORT',  label: 'International Master of Sport' },
]

export const MUSCLE_GROUPS = [
  { value: 'CHEST',      label: 'Chest' },
  { value: 'BACK',       label: 'Back' },
  { value: 'SHOULDERS',  label: 'Shoulders' },
  { value: 'BICEPS',     label: 'Biceps' },
  { value: 'TRICEPS',    label: 'Triceps' },
  { value: 'LEGS',       label: 'Legs' },
  { value: 'GLUTES',     label: 'Glutes' },
  { value: 'CORE',       label: 'Core' },
  { value: 'CALVES',     label: 'Calves' },
  { value: 'FULL_BODY',  label: 'Full Body' },
  { value: 'UPPER_BODY', label: 'Upper Body' },
  { value: 'LOWER_BODY', label: 'Lower Body' },
]

export const EXERCISE_TYPES = [
  { value: 'STRENGTH',    label: 'Strength' },
  { value: 'CARDIO',      label: 'Cardio' },
  { value: 'FLEXIBILITY', label: 'Flexibility' },
  { value: 'POWER',       label: 'Power' },
  { value: 'ENDURANCE',   label: 'Endurance' },
  { value: 'BALANCE',     label: 'Balance' },
  { value: 'TECHNIQUE',   label: 'Technique' },
]

export const LOAD_UNITS = [
  { value: 'KG',             label: 'kg' },
  { value: 'LB',             label: 'lb' },
  { value: 'PERCENT_OF_MAX', label: '% of 1RM' },
  { value: 'BODYWEIGHT',     label: 'Bodyweight' },
  { value: 'RPE',            label: 'RPE' },
  { value: 'SECONDS',        label: 'Seconds' },
  { value: 'METERS',         label: 'Meters' },
  { value: 'REPS',           label: 'Reps' },
]

// --- badge variant mappings (language-independent) ---

const QUAL_BADGE_VARIANT = {
  BEGINNER:                      'gray',
  INTERMEDIATE:                  'blue',
  ADVANCED:                      'indigo',
  CANDIDATE_MASTER_OF_SPORT:     'purple',
  MASTER_OF_SPORT:               'orange',
  INTERNATIONAL_MASTER_OF_SPORT: 'green',
}

const TYPE_BADGE_VARIANT = {
  STRENGTH:    'red',
  CARDIO:      'orange',
  FLEXIBILITY: 'blue',
  POWER:       'purple',
  ENDURANCE:   'green',
  BALANCE:     'indigo',
  TECHNIQUE:   'gray',
}

const MUSCLE_BADGE_VARIANT = {
  CHEST:      'red',
  BACK:       'blue',
  SHOULDERS:  'purple',
  BICEPS:     'indigo',
  TRICEPS:    'orange',
  LEGS:       'green',
  GLUTES:     'orange',
  CORE:       'red',
  CALVES:     'gray',
  FULL_BODY:  'indigo',
  UPPER_BODY: 'blue',
  LOWER_BODY: 'green',
}

// t is optional; if omitted, falls back to English label
export const qualBadge = (v, t) => ({
  label:   t ? t(`enums.qualBadge.${v}`) : (QUALIFICATIONS.find(q => q.value === v)?.label ?? v),
  variant: QUAL_BADGE_VARIANT[v] ?? 'gray',
})

export const typeBadge = (v, t) => ({
  label:   t ? t(`enums.type.${v}`) : v?.replace(/_/g, ' '),
  variant: TYPE_BADGE_VARIANT[v] ?? 'gray',
})

export const muscleBadge = (v, t) => ({
  label:   t ? t(`enums.muscle.${v}`) : v?.replace(/_/g, ' '),
  variant: MUSCLE_BADGE_VARIANT[v] ?? 'gray',
})

// Returns translated options arrays for use in Select components
export const translatedQualifications = (t) =>
  QUALIFICATIONS.map((q) => ({ value: q.value, label: t(`enums.qual.${q.value}`) }))

export const translatedMuscleGroups = (t) =>
  MUSCLE_GROUPS.map((m) => ({ value: m.value, label: t(`enums.muscle.${m.value}`) }))

export const translatedExerciseTypes = (t) =>
  EXERCISE_TYPES.map((e) => ({ value: e.value, label: t(`enums.type.${e.value}`) }))

export const translatedLoadUnits = (t) =>
  LOAD_UNITS.map((u) => ({ value: u.value, label: t(`enums.unit.${u.value}`) }))

export const labelOf = (arr, value) => arr.find((x) => x.value === value)?.label ?? value
