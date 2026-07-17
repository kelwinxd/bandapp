import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { listMusicians } from '../api/musiciansApi'
import { listSongs } from '../api/songsApi'
import { createService, type ServiceInput } from '../api/servicesApi'
import type { Musician, Song } from '../types'
import { ServiceForm } from '../components/services/ServiceForm'

export function NewServicePage() {
  const navigate = useNavigate()
  const [musicians, setMusicians] = useState<Musician[]>([])
  const [songs, setSongs] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([listMusicians(), listSongs()]).then(([musiciansData, songsData]) => {
      setMusicians(musiciansData)
      setSongs(songsData)
      setIsLoading(false)
    })
  }, [])

  async function handleCreate(input: ServiceInput) {
    const service = await createService(input)
    navigate(`/escalas/${service.id}`)
  }

  return (
    <div>
      <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
        ← Voltar
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-gray-900">Nova escala</h1>
      <p className="mt-1 text-sm text-gray-500">
        Defina a data do culto e escale os músicos e o repertório.
      </p>

      {isLoading ? (
        <p className="mt-6 text-sm text-gray-500">Carregando...</p>
      ) : (
        <div className="mt-6">
          <ServiceForm musicians={musicians} songs={songs} onSubmit={handleCreate} submitLabel="Criar escala" />
        </div>
      )}
    </div>
  )
}
