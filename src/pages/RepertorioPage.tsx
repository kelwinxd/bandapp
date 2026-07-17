import { useEffect, useState } from 'react'
import { listSongs } from '../api/songsApi'
import type { Song } from '../types'
import { Card } from '../components/ui/Card'
import { AddSongModal } from '../components/songs/AddSongModal'
import { useAuth } from '../contexts/useAuth'

export function RepertorioPage() {
  const { isAdmin } = useAuth()
  const [songs, setSongs] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddSongOpen, setIsAddSongOpen] = useState(false)

  useEffect(() => {
    listSongs().then((data) => {
      setSongs(data)
      setIsLoading(false)
    })
  }, [])

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Repertório</h1>
          <p className="mt-1 text-sm text-gray-500">Louvores cadastrados para as escalas.</p>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={() => setIsAddSongOpen(true)}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
          >
            + Adicionar música
          </button>
        )}
      </div>

      {isLoading ? (
        <p className="mt-6 text-sm text-gray-500">Carregando...</p>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {songs.map((song) => (
            <Card key={song.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{song.name}</p>
                <p className="text-sm text-gray-500">Tom: {song.key}</p>
              </div>
              {song.referenceLink && (
                <a
                  href={song.referenceLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  Ouvir
                </a>
              )}
            </Card>
          ))}
        </div>
      )}

      {isAddSongOpen && (
        <AddSongModal
          onClose={() => setIsAddSongOpen(false)}
          onCreated={(song) => {
            setSongs((prev) => [...prev, song])
            setIsAddSongOpen(false)
          }}
        />
      )}
    </div>
  )
}
