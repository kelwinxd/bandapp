import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { ChurchService } from '../../types'

interface AgendaCalendarProps {
  services: ChurchService[]
}

const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function toIsoDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function buildMonthCells(year: number, month: number): (number | null)[] {
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = Array.from({ length: firstWeekday }, () => null)
  for (let day = 1; day <= daysInMonth; day++) cells.push(day)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export function AgendaCalendar({ services }: AgendaCalendarProps) {
  const today = new Date()
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const cells = buildMonthCells(year, month)
  const monthLabel = cursor.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  function servicesForDay(day: number): ChurchService[] {
    const iso = toIsoDate(year, month, day)
    return services.filter((service) => service.date === iso)
  }

  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCursor(new Date(year, month - 1, 1))}
          className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
          aria-label="Mês anterior"
        >
          ←
        </button>
        <h2 className="text-sm font-semibold capitalize text-gray-900">{monthLabel}</h2>
        <button
          type="button"
          onClick={() => setCursor(new Date(year, month + 1, 1))}
          className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
          aria-label="Próximo mês"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="px-1 text-center text-xs font-medium text-gray-400">
            {label}
          </div>
        ))}

        {cells.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} />
          }
          const dayServices = servicesForDay(day)
          const hasService = dayServices.length > 0
          return (
            <div
              key={day}
              className={`min-h-[92px] rounded-lg border p-1.5 text-xs ${
                hasService ? 'border-brand-300 bg-brand-50' : 'border-gray-100'
              }`}
            >
              <p className="text-right text-[11px] text-gray-400">{day}</p>
              <div className="mt-1 space-y-1">
                {dayServices.map((service) => (
                  <Link
                    key={service.id}
                    to={`/escalas/${service.id}`}
                    className="block truncate rounded bg-brand-600 px-1 py-0.5 text-[10px] font-medium text-white hover:bg-brand-700"
                  >
                    {service.time} · {service.musicians.length} músicos
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
