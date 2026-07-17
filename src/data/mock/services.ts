import type { ChurchService } from '../../types'

export const mockServices: ChurchService[] = [
  {
    id: 'sv1',
    date: '2026-07-19',
    time: '18:00',
    notes: 'Culto de domingo à noite',
    musicians: [
      { musicianId: 'm1', role: 'Violão' },
      { musicianId: 'm2', role: 'Vocal' },
      { musicianId: 'm3', role: 'Bateria' },
      { musicianId: 'm5', role: 'Contrabaixo' },
    ],
    songs: [
      { songId: 's1', position: 1 },
      { songId: 's3', position: 2 },
      { songId: 's5', position: 3 },
    ],
  },
  {
    id: 'sv2',
    date: '2026-07-23',
    time: '20:00',
    notes: 'Culto de quinta-feira',
    musicians: [
      { musicianId: 'm1', role: 'Violão' },
      { musicianId: 'm4', role: 'Teclado' },
      { musicianId: 'm2', role: 'Vocal' },
    ],
    songs: [
      { songId: 's2', position: 1 },
      { songId: 's4', position: 2 },
    ],
  },
  {
    id: 'sv3',
    date: '2026-07-26',
    time: '18:00',
    notes: null,
    musicians: [
      { musicianId: 'm3', role: 'Bateria' },
      { musicianId: 'm5', role: 'Contrabaixo' },
      { musicianId: 'm4', role: 'Teclado' },
    ],
    songs: [
      { songId: 's1', position: 1 },
      { songId: 's5', position: 2 },
    ],
  },
]
