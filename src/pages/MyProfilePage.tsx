import { useEffect, useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'
import { getMusicianById, updateMusician } from '../api/musiciansApi'
import { INSTRUMENTS, type Instrument, type Musician } from '../types'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Avatar } from '../components/ui/Avatar'
import { formatPhone } from '../utils/format'

export function MyProfilePage() {
  const { user, updateUser } = useAuth()
  const [musician, setMusician] = useState<Musician | null | undefined>(undefined)
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [instruments, setInstruments] = useState<Instrument[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!user?.musicianId) return
    getMusicianById(user.musicianId).then((data) => {
      setMusician(data ?? null)
      if (data) {
        setName(data.name)
        setPhone(data.phone)
        setInstruments(data.instruments)
      }
    })
  }, [user?.musicianId])

  if (!user?.musicianId) {
    return <Navigate to="/" replace />
  }

  function toggleInstrument(instrument: Instrument) {
    setInstruments((prev) =>
      prev.includes(instrument) ? prev.filter((i) => i !== instrument) : [...prev, instrument],
    )
  }

  function startEditing() {
    if (musician) {
      setName(musician.name)
      setPhone(musician.phone)
      setInstruments(musician.instruments)
    }
    setError(null)
    setSuccess(false)
    setIsEditing(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Informe seu nome.')
      return
    }
    if (!phone.trim()) {
      setError('Informe seu telefone.')
      return
    }
    if (instruments.length === 0) {
      setError('Selecione ao menos um instrumento.')
      return
    }

    setIsSubmitting(true)
    try {
      const updated = await updateMusician(user!.musicianId!, {
        name: name.trim(),
        phone: phone.trim(),
        instruments,
      })
      setMusician(updated)
      updateUser({ name: updated.name })
      setIsEditing(false)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar as alterações.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (musician === undefined) {
    return <p className="text-sm text-gray-500">Carregando...</p>
  }

  if (musician === null) {
    return <p className="text-sm text-gray-500">Não encontramos seu cadastro de músico.</p>
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <Avatar name={musician.name} photoUrl={musician.photoUrl} size="lg" />
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Meu perfil</h1>
          <p className="text-sm text-gray-500">{musician.email}</p>
        </div>
      </div>

      {success && !isEditing && (
        <p className="mt-4 text-sm text-green-600">Perfil atualizado com sucesso.</p>
      )}

      {isEditing ? (
        <Card className="mt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="my-name" className="mb-1 block text-sm font-medium text-gray-700">
                Nome
              </label>
              <input
                id="my-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label htmlFor="my-phone" className="mb-1 block text-sm font-medium text-gray-700">
                Telefone (WhatsApp)
              </label>
              <input
                id="my-phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="5511999990000"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <p className="mb-1 block text-sm font-medium text-gray-700">Instrumentos</p>
              <div className="grid grid-cols-2 gap-1.5">
                {INSTRUMENTS.map((instrument) => (
                  <label key={instrument} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={instruments.includes(instrument)}
                      onChange={() => toggleInstrument(instrument)}
                      className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                    />
                    {instrument}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge tone={musician.active ? 'green' : 'red'}>
                {musician.active ? 'Ativo' : 'Inativo'}
              </Badge>
              <span className="text-xs text-gray-400">Status definido pela liderança</span>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
              >
                {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        </Card>
      ) : (
        <Card className="mt-6">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Nome</p>
                <p className="mt-0.5 text-sm text-gray-900">{musician.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Telefone (WhatsApp)
                </p>
                <p className="mt-0.5 text-sm text-gray-900">{formatPhone(musician.phone)}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Instrumentos
                </p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {musician.instruments.map((instrument) => (
                    <Badge key={instrument} tone="brand">
                      {instrument}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={musician.active ? 'green' : 'red'}>
                  {musician.active ? 'Ativo' : 'Inativo'}
                </Badge>
                <span className="text-xs text-gray-400">Status definido pela liderança</span>
              </div>
            </div>
            <button
              type="button"
              onClick={startEditing}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
            >
              Editar
            </button>
          </div>
        </Card>
      )}
    </div>
  )
}
