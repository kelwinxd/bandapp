import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getServiceById, updateService, type ServiceInput } from '../api/servicesApi'
import { listMusicians } from '../api/musiciansApi'
import { listSongs } from '../api/songsApi'
import type { ChurchService, Musician, Song } from '../types'
import { ServiceForm } from '../components/services/ServiceForm'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Avatar } from '../components/ui/Avatar'
import { useAuth } from '../contexts/useAuth'
import { formatServiceDate } from '../utils/format'

export function ServicePage() {
  const { isAdmin } = useAuth()
  const { id } = useParams<{ id: string }>()
  const [service, setService] = useState<ChurchService | null | undefined>(undefined)
  const [musicians, setMusicians] = useState<Musician[]>([])
  const [songs, setSongs] = useState<Song[]>([])
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (!id) return
    Promise.all([getServiceById(id), listMusicians(), listSongs()]).then(
      ([serviceData, musiciansData, songsData]) => {
        setService(serviceData ?? null)
        setMusicians(musiciansData)
        setSongs(songsData)
      },
    )
  }, [id])

  async function handleUpdate(input: ServiceInput) {
    if (!id) return
    const updated = await updateService(id, input)
    setService(updated)
    setIsEditing(false)
  }

  function musicianById(musicianId: string) {
    return musicians.find((m) => m.id === musicianId)
  }

  function songById(songId: string) {
    return songs.find((s) => s.id === songId)
  }

  if (service === undefined) {
    return <p className="text-sm text-gray-500">Carregando...</p>
  }

  if (service === null) {
    return (
      <div>
        <p className="text-sm text-gray-500">Escala não encontrada.</p>
        <Link to="/" className="mt-2 inline-block text-sm text-brand-600 hover:text-brand-700">
          Voltar para o início
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
        ← Voltar
      </Link>

      {isEditing && isAdmin ? (
        <>
          <h1 className="mt-2 text-2xl font-semibold text-gray-900">Editar escala</h1>
          <div className="mt-6">
            <ServiceForm
              initialValues={service}
              musicians={musicians}
              songs={songs}
              onSubmit={handleUpdate}
              submitLabel="Salvar alterações"
              onCancel={() => setIsEditing(false)}
            />
          </div>
        </>
      ) : (
        <>
          <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold capitalize text-gray-900">
                {formatServiceDate(service.date)}
              </h1>
              <p className="text-sm text-gray-500">
                {service.time} {service.notes ? `· ${service.notes}` : ''}
              </p>
            </div>
            {isAdmin && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
              >
                Editar
              </button>
            )}
          </div>

          <Card className="mt-6">
            <h2 className="mb-3 text-sm font-semibold text-gray-900">Músicos escalados</h2>
            <div className="flex flex-wrap gap-3">
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
              {service.musicians.length === 0 && (
                <p className="text-sm text-gray-500">Nenhum músico escalado ainda.</p>
              )}
            </div>
          </Card>

          <Card className="mt-4">
            <h2 className="mb-3 text-sm font-semibold text-gray-900">Repertório</h2>
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
              {service.songs.length === 0 && (
                <p className="text-sm text-gray-500">Nenhuma música definida ainda.</p>
              )}
            </ul>
          </Card>
        </>
      )}
    </div>
  )
}
