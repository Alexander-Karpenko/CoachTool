import { Skeleton } from '../common/Skeleton'

const SKELETON_HEIGHTS = [55, 75, 40, 95, 65, 30, 10]

function formatVolume(v) {
  return v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`
}

export function WeeklyVolume({ data, loading }) {
  const today      = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()]
  const maxVolume  = Math.max(...(data?.map((d) => d.volume) ?? [1]), 1)
  const totalVolume = data?.reduce((sum, d) => sum + d.volume, 0) ?? 0

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        {loading ? (
          <>
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-5 w-24" />
          </>
        ) : (
          <>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Weekly Training Volume</h3>
              <p className="text-xs text-gray-400 mt-0.5">weight × reps × sets per session</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Total this week</p>
              <p className="text-sm font-bold text-indigo-600">{formatVolume(totalVolume)} kg</p>
            </div>
          </>
        )}
      </div>

      {/* Chart */}
      <div className="flex items-end gap-2 mt-5" style={{ height: '120px' }}>
        {loading
          ? SKELETON_HEIGHTS.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end" style={{ height: '96px' }}>
                  <Skeleton className="w-full rounded-t-md" style={{ height: `${h}%` }} />
                </div>
                <Skeleton className="h-3 w-6" />
              </div>
            ))
          : data.map(({ day, volume }) => {
              const heightPct = volume > 0 ? Math.max((volume / maxVolume) * 100, 8) : 0
              const isToday   = day === today

              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-1.5 group">
                  {/* Tooltip on hover */}
                  <span className={`text-xs font-medium transition-opacity ${
                    volume > 0 ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'
                  } text-gray-500 whitespace-nowrap`}>
                    {formatVolume(volume)}
                  </span>

                  {/* Bar */}
                  <div className="relative w-full flex items-end" style={{ height: '96px' }}>
                    {volume === 0 ? (
                      <div className="w-full h-1 rounded-sm bg-gray-100" />
                    ) : (
                      <div
                        className={`w-full rounded-t-md transition-all duration-700 ${
                          isToday
                            ? 'bg-indigo-600 shadow-sm shadow-indigo-200'
                            : 'bg-indigo-200 group-hover:bg-indigo-300'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                    )}
                  </div>

                  {/* Day label */}
                  <span className={`text-xs font-medium ${
                    isToday ? 'text-indigo-600' : 'text-gray-400'
                  }`}>
                    {day}
                  </span>
                </div>
              )
            })
        }
      </div>

      {/* Legend */}
      {!loading && (
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm bg-indigo-600" />
            <span className="text-xs text-gray-500">Today</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm bg-indigo-200" />
            <span className="text-xs text-gray-500">Other days</span>
          </div>
        </div>
      )}
    </div>
  )
}
