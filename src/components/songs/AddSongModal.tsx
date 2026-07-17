import { useState, type FormEvent } from 'react'
import { MUSICAL_KEYS, type MusicalKey, type Song } from '../../types'
import { createSong } from '../../api/songsApi'

interface AddSongModalProps {
  onClose: () => void
  onCreated: (song: Song) => void
}

export function AddSongModal({ onClose, onCreated }: AddSongModalProps) {
  const [name, setName] = useState('')
  const [key, setKey] = useState<MusicalKey>('A definir')
  const [referenceLink, setReferenceLink] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Informe o nome da música.')
      return
    }

    setIsSubmitting(true)
    try {
      const song = await createSong({
        name: name.trim(),
        key,
        referenceLink: referenceLink.trim() ? referenceLink.trim() : null,
      })
      onCreated(song)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar a música.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900">Adicionar música</h2>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="song-name" className="mb-1 block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              id="song-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Grande é o Senhor"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div>
            <label htmlFor="song-key" className="mb-1 block text-sm font-medium text-gray-700">
              Tom
            </label>
            <select
              id="song-key"
              value={key}
              onChange={(e) => setKey(e.target.value as MusicalKey)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            >
              {MUSICAL_KEYS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="song-link" className="mb-1 block text-sm font-medium text-gray-700">
              Link de referência
            </label>
            <input
              id="song-link"
              type="url"
              value={referenceLink}
              onChange={(e) => setReferenceLink(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
            >
              {isSubmitting ? 'Salvando...' : 'Adicionar'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
