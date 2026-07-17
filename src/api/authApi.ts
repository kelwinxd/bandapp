import type { AuthRole, AuthUser } from '../types'
import { mockDelay } from './client'
import { getMusicianByEmail } from './musiciansApi'

export interface LoginInput {
  email: string
  password: string
  role: AuthRole
}

// TODO: substituir por supabase.auth.signInWithPassword({ email, password }) + leitura do perfil/role
export async function login(input: LoginInput): Promise<AuthUser> {
  const { email, password, role } = input

  if (!email || !password) {
    throw new Error('Informe e-mail e senha.')
  }
  if (password.length < 4) {
    throw new Error('Credenciais inválidas.')
  }

  if (role === 'musico') {
    const musician = await getMusicianByEmail(email)
    if (!musician) {
      throw new Error('Nenhum músico cadastrado com esse e-mail.')
    }
    return mockDelay({
      id: `musico-${musician.id}`,
      name: musician.name,
      email: musician.email,
      role: 'musico',
      musicianId: musician.id,
    })
  }

  return mockDelay({
    id: 'admin-1',
    name: 'Líder de Louvor',
    email,
    role: 'admin',
  })
}

// TODO: substituir por supabase.auth.signOut()
export async function logout(): Promise<void> {
  return mockDelay(undefined, 100)
}
