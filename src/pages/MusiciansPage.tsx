import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { listMusicians } from '../api/musiciansApi'
import { INSTRUMENTS, type Instrument, type Musician } from '../types'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Avatar } from '../components/ui/Avatar'
import { AddMusicianModal } from '../components/musicians/AddMusicianModal'
import { useAuth } from '../contexts/useAuth'
import { formatPhone } from '../utils/format'

type StatusFilter = 'todos' | 'ativo' | 'inativo'

export function MusiciansPage() {
  const { isAdmin } = useAuth()
  const [musicians, setMusicians] = useState<Musician[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [instrumentFilter, setInstrumentFilter] = useState<Instrument | 'todos'>('todos')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos')
  const [isAddMusicianOpen, setIsAddMusicianOpen] = useState(false)

  useEffect(() => {
    listMusicians().then((data) => {
      setMusicians(data)
      setIsLoading(false)
    })
  }, [])

  const filteredMusicians = useMemo(() => {
    const term = search.trim().toLowerCase()
    return musicians.filter((musician) => {
      const matchesName = term ? musician.name.toLowerCase().includes(term) : true
      const matchesInstrument =
        instrumentFilter === 'todos' ? true : musician.instruments.includes(instrumentFilter)
      const matchesStatus =
        statusFilter === 'todos'
          ? true
          : statusFilter === 'ativo'
            ? musician.active
            : !musician.active
      return matchesName && matchesInstrument && matchesStatus
    })
  }, [musicians, search, instrumentFilter, statusFilter])

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Músicos</h1>
          <p className="mt-1 text-sm text-gray-500">Todos os músicos cadastrados no ministério.</p>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={() => setIsAddMusicianOpen(true)}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
          >
            + Novo músico
          </button>
        )}
      </div>

      <Card className="mt-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="search" className="mb-1 block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              id="search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div>
            <label htmlFor="instrument" className="mb-1 block text-sm font-medium text-gray-700">
              Instrumento
            </label>
            <select
              id="instrument"
              value={instrumentFilter}
              onChange={(e) => setInstrumentFilter(e.target.value as Instrument | 'todos')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            >
              <option value="todos">Todos</option>
              {INSTRUMENTS.map((instrument) => (
                <option key={instrument} value={instrument}>
                  {instrument}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            >
              <option value="todos">Todos</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <p className="mt-6 text-sm text-gray-500">Carregando...</p>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {filteredMusicians.map((musician) => (
            <Link key={musician.id} to={`/musicos/${musician.id}`}>
              <Card className="flex items-center gap-4 transition hover:border-brand-300 hover:shadow-md">
                <Avatar name={musician.name} photoUrl={musician.photoUrl} size="md" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{musician.name}</p>
                  <p className="text-sm text-gray-500">{formatPhone(musician.phone)}</p>
                </div>
                <div className="flex flex-wrap items-end justify-end gap-1">
                  {musician.instruments.map((instrument) => (
                    <Badge key={instrument} tone="brand">
                      {instrument}
                    </Badge>
                  ))}
                  <Badge tone={musician.active ? 'green' : 'red'}>
                    {musician.active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </Card>
            </Link>
          ))}
          {filteredMusicians.length === 0 && (
            <p className="text-sm text-gray-500">Nenhum músico encontrado com esses filtros.</p>
          )}
        </div>
      )}

      {isAddMusicianOpen && (
        <AddMusicianModal
          onClose={() => setIsAddMusicianOpen(false)}
          onCreated={(musician) => {
            setMusicians((prev) => [...prev, musician])
            setIsAddMusicianOpen(false)
          }}
        />
      )}
    </div>
  )
}
