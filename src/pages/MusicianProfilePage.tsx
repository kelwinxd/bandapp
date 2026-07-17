import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getMusicianById } from '../api/musiciansApi'
import { getServicesByMusicianId } from '../api/servicesApi'
import type { ChurchService, Musician } from '../types'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Avatar } from '../components/ui/Avatar'
import { useAuth } from '../contexts/useAuth'
import { formatPhone, formatServiceDate } from '../utils/format'

export function MusicianProfilePage() {
  const { user } = useAuth()
  const { id } = useParams<{ id: string }>()
  const [musician, setMusician] = useState<Musician | null | undefined>(undefined)
  const [services, setServices] = useState<ChurchService[]>([])

  useEffect(() => {
    if (!id) return
    getMusicianById(id).then((data) => setMusician(data ?? null))
    getServicesByMusicianId(id).then(setServices)
  }, [id])

  if (musician === undefined) {
    return <p className="text-sm text-gray-500">Carregando...</p>
  }

  if (musician === null) {
    return (
      <div>
        <p className="text-sm text-gray-500">Músico não encontrado.</p>
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

      <Card className="mt-4">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar name={musician.name} photoUrl={musician.photoUrl} size="lg" />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{musician.name}</h1>
            <p className="text-sm text-gray-500">{formatPhone(musician.phone)}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {musician.instruments.map((instrument) => (
                <Badge key={instrument} tone="brand">
                  {instrument}
                </Badge>
              ))}
              <Badge tone={musician.active ? 'green' : 'red'}>
                {musician.active ? 'Ativo' : 'Inativo'}
              </Badge>
              {user?.musicianId === musician.id && <Badge tone="brand">Este é você</Badge>}
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-6">
        <h2 className="text-base font-semibold text-gray-900">Próximas escalas</h2>
        {services.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">Nenhuma escala futura para este músico.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {services.map((service) => {
              const role = service.musicians.find((m) => m.musicianId === musician.id)?.role
              return (
                <Card key={service.id}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium capitalize text-gray-900">
                        {formatServiceDate(service.date)}
                      </p>
                      <p className="text-sm text-gray-500">{service.time}</p>
                    </div>
                    {role && <Badge tone="brand">{role}</Badge>}
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
