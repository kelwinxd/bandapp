import type { ChurchService, ServiceMusician, ServiceSong } from '../types'
import { mockServices } from '../data/mock/services'
import { mockDelay } from './client'
import { readStorage, writeStorage } from '../utils/storage'

const STORAGE_KEY = 'bandapp:services'

function loadServices(): ChurchService[] {
  return readStorage(STORAGE_KEY, mockServices)
}

function saveServices(services: ChurchService[]): void {
  writeStorage(STORAGE_KEY, services)
}

// TODO: substituir por supabase.from('services').select('*, service_musicians(*), service_songs(*)')
export async function listUpcomingServices(): Promise<ChurchService[]> {
  const sorted = [...loadServices()].sort((a, b) => a.date.localeCompare(b.date))
  return mockDelay(sorted)
}

// TODO: substituir por supabase.from('services').select(...).eq('id', id).single()
export async function getServiceById(id: string): Promise<ChurchService | undefined> {
  return mockDelay(loadServices().find((service) => service.id === id))
}

// TODO: substituir por supabase.from('services').select(...).contains('service_musicians', ...)
export async function getServicesByMusicianId(musicianId: string): Promise<ChurchService[]> {
  const services = loadServices().filter((service) =>
    service.musicians.some((m) => m.musicianId === musicianId),
  )
  return mockDelay(services)
}

export interface ServiceInput {
  date: string
  time: string
  notes: string | null
  musicians: ServiceMusician[]
  songs: ServiceSong[]
}

// TODO: substituir por supabase.from('services').insert(...) + inserts nas tabelas de junção
export async function createService(input: ServiceInput): Promise<ChurchService> {
  const service: ChurchService = { id: crypto.randomUUID(), ...input }
  saveServices([...loadServices(), service])
  return mockDelay(service)
}

// TODO: substituir por supabase.from('services').update(...).eq('id', id)
export async function updateService(id: string, input: ServiceInput): Promise<ChurchService> {
  const services = loadServices()
  const updated: ChurchService = { id, ...input }
  saveServices(services.map((service) => (service.id === id ? updated : service)))
  return mockDelay(updated)
}
