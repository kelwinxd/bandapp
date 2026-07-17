import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { listUpcomingServices } from '../api/servicesApi'
import { listMusicians } from '../api/musiciansApi'
import { listSongs } from '../api/songsApi'
import type { ChurchService, Musician, Song } from '../types'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Avatar } from '../components/ui/Avatar'
import { AgendaCalendar } from '../components/services/AgendaCalendar'
import { useAuth } from '../contexts/useAuth'
import { formatServiceDate } from '../utils/format'

type ViewMode = 'lista' | 'agenda'

export function EscalasPage() {
  const { user, isAdmin } = useAuth()
  const [services, setServices] = useState<ChurchService[]>([])
  const [musicians, setMusicians] = useState<Musician[]>([])
  const [songs, setSongs] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('lista')

  useEffect(() => {
    Promise.all([listUpcomingServices(), listMusicians(), listSongs()]).then(
      ([servicesData, musiciansData, songsData]) => {
        setServices(servicesData)
        setMusicians(musiciansData)
        setSongs(songsData)
        setIsLoading(false)
      },
    )
  }, [])

  function musicianById(id: string) {
    return musicians.find((m) => m.id === id)
  }

  function songById(id: string) {
    return songs.find((s) => s.id === id)
  }

  const filteredServices = useMemo(() => {
    const term = isAdmin ? search.trim().toLowerCase() : ''
    return services.filter((service) => {
      if (!isAdmin) {
        const isMine = service.musicians.some((m) => m.musicianId === user?.musicianId)
        if (!isMine) return false
      }

      if (dateFilter && service.date !== dateFilter) return false
      if (!term) return true

      const dateText = formatServiceDate(service.date).toLowerCase()
      if (dateText.includes(term)) return true
      if (service.notes?.toLowerCase().includes(term)) return true

      const hasMusicianMatch = service.musicians.some((m) =>
        musicians.find((musician) => musician.id === m.musicianId)?.name.toLowerCase().includes(term),
      )
      if (hasMusicianMatch) return true

      const hasSongMatch = service.songs.some((s) =>
        songs.find((song) => song.id === s.songId)?.name.toLowerCase().includes(term),
      )
      if (hasSongMatch) return true

      return false
    })
  }, [services, search, dateFilter, musicians, songs, isAdmin, user])

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Escalas</h1>
          <p className="mt-1 text-sm text-gray-500">Próximos cultos e quem está escalado.</p>
        </div>
        {isAdmin && (
          <Link
            to="/escalas/nova"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
          >
            + Nova escala
          </Link>
        )}
      </div>

      <Card className="mt-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            {isAdmin ? (
              <>
                <label
                  htmlFor="service-search"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Buscar
                </label>
                <input
                  id="service-search"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Dia da semana, músico, música..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
              </>
            ) : (
              <>
                <p className="mb-1 block text-sm font-medium text-gray-700">Filtro</p>
                <p className="flex h-[38px] items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-600">
                  Escalas que eu estou
                </p>
              </>
            )}
          </div>
          <div>
            <label htmlFor="service-date" className="mb-1 block text-sm font-medium text-gray-700">
              Data
            </label>
            <input
              id="service-date"
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>
        </div>
      </Card>

      <div className="mt-6 flex gap-2 border-b border-gray-200">
        <ViewButton active={viewMode === 'lista'} onClick={() => setViewMode('lista')}>
          Lista
        </ViewButton>
        <ViewButton active={viewMode === 'agenda'} onClick={() => setViewMode('agenda')}>
          Agenda
        </ViewButton>
      </div>

      {isLoading ? (
        <p className="mt-6 text-sm text-gray-500">Carregando...</p>
      ) : viewMode === 'agenda' ? (
        <AgendaCalendar services={filteredServices} />
      ) : (
        <div className="mt-6 space-y-4">
          {filteredServices.map((service) => (
            <Card key={service.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <Link to={`/escalas/${service.id}`} className="hover:underline">
                  <h2 className="text-base font-semibold capitalize text-gray-900">
                    {formatServiceDate(service.date)}
                  </h2>
                </Link>
                <Badge tone="brand">{service.musicians.length} escalados</Badge>
              </div>
              <p className="text-sm text-gray-500">
                {service.time} {service.notes ? `· ${service.notes}` : ''}
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                {service.musicians.map(({ musicianId, role }) => {
                  const musician = musicianById(musicianId)
                  if (!musician) return null
                  return (
                    <Link
                      key={musicianId}
                      to={`/musicos/${musicianId}`}
                      className="flex items-center gap-2 rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm hover:bg-gray-50"
                    >
                      <Avatar name={musician.name} photoUrl={musician.photoUrl} size="sm" />
                      <span>
                        <span className="block font-medium text-gray-800">{musician.name}</span>
                        <span className="block text-xs text-gray-500">{role}</span>
                      </span>
                    </Link>
                  )
                })}
              </div>

              <div className="mt-4 border-t border-gray-100 pt-3">
                <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-gray-400">
                  Repertório
                </p>
                <ul className="flex flex-wrap gap-2">
                  {service.songs
                    .slice()
                    .sort((a, b) => a.position - b.position)
                    .map(({ songId }) => {
                      const song = songById(songId)
                      if (!song) return null
                      return (
                        <li key={songId}>
                          <Badge>
                            {song.name} · {song.key}
                          </Badge>
                        </li>
                      )
                    })}
                </ul>
              </div>
            </Card>
          ))}
          {filteredServices.length === 0 && (
            <p className="text-sm text-gray-500">Nenhuma escala encontrada com esses filtros.</p>
          )}
        </div>
      )}
    </div>
  )
}

function ViewButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition ${
        active
          ? 'border-brand-600 text-brand-700'
          : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      {children}
    </button>
  )
}
