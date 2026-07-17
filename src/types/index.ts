export const INSTRUMENTS = [
  'Vocal',
  'Violão',
  'Guitarra',
  'Contrabaixo',
  'Bateria',
  'Teclado',
  'Cajón',
  'Outro',
] as const
export type Instrument = (typeof INSTRUMENTS)[number]

export interface Musician {
  id: string
  name: string
  email: string
  phone: string // E.164, ex: 5511999999999
  instruments: Instrument[]
  photoUrl: string | null
  active: boolean
}

export const MUSICAL_KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'A definir'] as const
export type MusicalKey = (typeof MUSICAL_KEYS)[number]

export interface Song {
  id: string
  name: string
  referenceLink: string | null
  chordSheetUrl: string | null
  key: MusicalKey
}

export interface ServiceMusician {
  musicianId: string
  role: string
}

export interface ServiceSong {
  songId: string
  position: number
}

export interface ChurchService {
  id: string
  date: string // YYYY-MM-DD
  time: string // HH:mm
  notes: string | null
  musicians: ServiceMusician[]
  songs: ServiceSong[]
}

export type NotificationType = 'antes' | 'dia'
export type NotificationStatus = 'enviado' | 'falhou'

export interface NotificationLog {
  id: string
  serviceId: string
  musicianId: string
  type: NotificationType
  status: NotificationStatus
  sentAt: string
}

export type AuthRole = 'admin' | 'musico'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: AuthRole
  musicianId?: string
}
