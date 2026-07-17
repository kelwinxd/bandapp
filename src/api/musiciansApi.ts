import type { Instrument, Musician } from '../types'
import { mockMusicians } from '../data/mock/musicians'
import { mockDelay } from './client'
import { readStorage, writeStorage } from '../utils/storage'

const STORAGE_KEY = 'bandapp:musicians'

function loadMusicians(): Musician[] {
  return readStorage(STORAGE_KEY, mockMusicians)
}

// TODO: substituir por supabase.from('musicians').select('*')
export async function listMusicians(): Promise<Musician[]> {
  return mockDelay(loadMusicians())
}

// TODO: substituir por supabase.from('musicians').select('*').eq('id', id).single()
export async function getMusicianById(id: string): Promise<Musician | undefined> {
  return mockDelay(loadMusicians().find((musician) => musician.id === id))
}

// TODO: substituir por supabase.from('musicians').select('*').eq('email', email).single()
export async function getMusicianByEmail(email: string): Promise<Musician | undefined> {
  const normalized = email.trim().toLowerCase()
  return mockDelay(
    loadMusicians().find((musician) => musician.email.toLowerCase() === normalized),
  )
}

export interface CreateMusicianInput {
  name: string
  email: string
  phone: string
  instruments: Instrument[]
  active: boolean
}

// TODO: substituir por supabase.from('musicians').insert(input).select().single()
export async function createMusician(input: CreateMusicianInput): Promise<Musician> {
  const musician: Musician = {
    id: crypto.randomUUID(),
    name: input.name,
    email: input.email,
    phone: input.phone,
    instruments: input.instruments,
    active: input.active,
    photoUrl: null,
  }
  writeStorage(STORAGE_KEY, [...loadMusicians(), musician])
  return mockDelay(musician)
}

export interface UpdateMusicianInput {
  name: string
  phone: string
  instruments: Instrument[]
}

// TODO: substituir por supabase.from('musicians').update(input).eq('id', id)
export async function updateMusician(id: string, input: UpdateMusicianInput): Promise<Musician> {
  const musicians = loadMusicians()
  const existing = musicians.find((musician) => musician.id === id)
  if (!existing) {
    throw new Error('Músico não encontrado.')
  }
  const updated: Musician = { ...existing, ...input }
  writeStorage(
    STORAGE_KEY,
    musicians.map((musician) => (musician.id === id ? updated : musician)),
  )
  return mockDelay(updated)
}
