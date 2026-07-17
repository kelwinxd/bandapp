import type { MusicalKey, Song } from '../types'
import { mockSongs } from '../data/mock/songs'
import { mockDelay } from './client'
import { readStorage, writeStorage } from '../utils/storage'

const STORAGE_KEY = 'bandapp:songs'

function loadSongs(): Song[] {
  return readStorage(STORAGE_KEY, mockSongs)
}

// TODO: substituir por supabase.from('songs').select('*')
export async function listSongs(): Promise<Song[]> {
  return mockDelay(loadSongs())
}

export interface CreateSongInput {
  name: string
  key: MusicalKey
  referenceLink: string | null
}

// TODO: substituir por supabase.from('songs').insert(input).select().single()
export async function createSong(input: CreateSongInput): Promise<Song> {
  const song: Song = {
    id: crypto.randomUUID(),
    name: input.name,
    key: input.key,
    referenceLink: input.referenceLink,
    chordSheetUrl: null,
  }
  writeStorage(STORAGE_KEY, [...loadSongs(), song])
  return mockDelay(song)
}
