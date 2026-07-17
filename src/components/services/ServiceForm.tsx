import { useMemo, useState, type FormEvent } from 'react'
import { INSTRUMENTS, type ChurchService, type Instrument, type Musician, type Song } from '../../types'
import type { ServiceInput } from '../../api/servicesApi'
import { Card } from '../ui/Card'

interface ServiceFormProps {
  initialValues?: ChurchService
  musicians: Musician[]
  songs: Song[]
  submitLabel: string
  onSubmit: (input: ServiceInput) => Promise<void>
  onCancel?: () => void
}

export function ServiceForm({
  initialValues,
  musicians,
  songs,
  submitLabel,
  onSubmit,
  onCancel,
}: ServiceFormProps) {
  const [date, setDate] = useState(initialValues?.date ?? '')
  const [time, setTime] = useState(initialValues?.time ?? '')
  const [notes, setNotes] = useState(initialValues?.notes ?? '')
  const [roleByMusicianId, setRoleByMusicianId] = useState<Record<string, string>>(() =>
    Object.fromEntries((initialValues?.musicians ?? []).map((m) => [m.musicianId, m.role])),
  )
  const [selectedSongIds, setSelectedSongIds] = useState<string[]>(() =>
    (initialValues?.songs ?? [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((s) => s.songId),
  )
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [musicianSearch, setMusicianSearch] = useState('')
  const [musicianInstrumentFilter, setMusicianInstrumentFilter] = useState<Instrument | 'todos'>(
    'todos',
  )

  const filteredMusicians = useMemo(() => {
    const term = musicianSearch.trim().toLowerCase()
    return musicians.filter((musician) => {
      const matchesName = term ? musician.name.toLowerCase().includes(term) : true
      const matchesInstrument =
        musicianInstrumentFilter === 'todos'
          ? true
          : musician.instruments.includes(musicianInstrumentFilter)
      return matchesName && matchesInstrument
    })
  }, [musicians, musicianSearch, musicianInstrumentFilter])

  function toggleMusician(musician: Musician) {
    setRoleByMusicianId((prev) => {
      const next = { ...prev }
      if (musician.id in next) {
        delete next[musician.id]
      } else {
        next[musician.id] = musician.instruments[0] ?? ''
      }
      return next
    })
  }

  function updateRole(musicianId: string, role: string) {
    setRoleByMusicianId((prev) => ({ ...prev, [musicianId]: role }))
  }

  function toggleSong(songId: string) {
    setSelectedSongIds((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId],
    )
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!date || !time) {
      setError('Informe a data e o horário do culto.')
      return
    }
    if (Object.keys(roleByMusicianId).length === 0) {
      setError('Escale ao menos um músico.')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({
        date,
        time,
        notes: notes.trim() ? notes.trim() : null,
        musicians: Object.entries(roleByMusicianId).map(([musicianId, role]) => ({
          musicianId,
          role,
        })),
        songs: selectedSongIds.map((songId, index) => ({ songId, position: index + 1 })),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar a escala.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="date" className="mb-1 block text-sm font-medium text-gray-700">
              Data
            </label>
            <input
              id="date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <div>
            <label htmlFor="time" className="mb-1 block text-sm font-medium text-gray-700">
              Horário
            </label>
            <input
              id="time"
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="notes" className="mb-1 block text-sm font-medium text-gray-700">
            Observações
          </label>
          <textarea
            id="notes"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex: Culto de domingo à noite"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Músicos escalados</h3>

        <div className="mb-3 grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            value={musicianSearch}
            onChange={(e) => setMusicianSearch(e.target.value)}
            placeholder="Buscar por nome..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
          <select
            value={musicianInstrumentFilter}
            onChange={(e) => setMusicianInstrumentFilter(e.target.value as Instrument | 'todos')}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          >
            <option value="todos">Todos os instrumentos</option>
            {INSTRUMENTS.map((instrument) => (
              <option key={instrument} value={instrument}>
                {instrument}
              </option>
            ))}
          </select>
        </div>

        <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
          {filteredMusicians.map((musician) => {
            const isSelected = musician.id in roleByMusicianId
            return (
              <div
                key={musician.id}
                className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-100 px-3 py-2"
              >
                <label className="flex flex-1 items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleMusician(musician)}
                    className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className={musician.active ? 'text-gray-800' : 'text-gray-400'}>
                    {musician.name}
                    {!musician.active && ' (inativo)'}
                  </span>
                </label>
                {isSelected && (
                  <select
                    value={roleByMusicianId[musician.id]}
                    onChange={(e) => updateRole(musician.id, e.target.value)}
                    className="w-40 rounded-lg border border-gray-300 px-2 py-1 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  >
                    {musician.instruments.map((instrument) => (
                      <option key={instrument} value={instrument}>
                        {instrument}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )
          })}
          {filteredMusicians.length === 0 && (
            <p className="text-sm text-gray-500">Nenhum músico encontrado com esses filtros.</p>
          )}
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Repertório</h3>
        <div className="space-y-2">
          {songs.map((song) => (
            <label
              key={song.id}
              className="flex items-center gap-2 rounded-lg border border-gray-100 px-3 py-2 text-sm"
            >
              <input
                type="checkbox"
                checked={selectedSongIds.includes(song.id)}
                onChange={() => toggleSong(song.id)}
                className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-gray-800">{song.name}</span>
              <span className="text-xs text-gray-400">Tom: {song.key}</span>
            </label>
          ))}
        </div>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {isSubmitting ? 'Salvando...' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}
