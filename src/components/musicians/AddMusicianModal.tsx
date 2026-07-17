import { useState, type FormEvent } from 'react'
import { INSTRUMENTS, type Instrument, type Musician } from '../../types'
import { createMusician } from '../../api/musiciansApi'

interface AddMusicianModalProps {
  onClose: () => void
  onCreated: (musician: Musician) => void
}

export function AddMusicianModal({ onClose, onCreated }: AddMusicianModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [instruments, setInstruments] = useState<Instrument[]>([])
  const [active, setActive] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function toggleInstrument(instrument: Instrument) {
    setInstruments((prev) =>
      prev.includes(instrument) ? prev.filter((i) => i !== instrument) : [...prev, instrument],
    )
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Informe o nome do músico.')
      return
    }
    if (!email.trim()) {
      setError('Informe o e-mail do músico (usado para login).')
      return
    }
    if (!phone.trim()) {
      setError('Informe o telefone com DDI e DDD, ex: 5511999990000.')
      return
    }
    if (instruments.length === 0) {
      setError('Selecione ao menos um instrumento.')
      return
    }

    setIsSubmitting(true)
    try {
      const musician = await createMusician({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        instruments,
        active,
      })
      onCreated(musician)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar o músico.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900">Novo músico</h2>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="musician-name" className="mb-1 block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              id="musician-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: João da Silva"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div>
            <label htmlFor="musician-email" className="mb-1 block text-sm font-medium text-gray-700">
              E-mail (login)
            </label>
            <input
              id="musician-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="joao@igreja.com"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div>
            <label htmlFor="musician-phone" className="mb-1 block text-sm font-medium text-gray-700">
              Telefone (WhatsApp)
            </label>
            <input
              id="musician-phone"
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

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            Ativo
          </label>

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
