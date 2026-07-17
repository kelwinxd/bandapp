import { createContext } from 'react'
import type { AuthUser } from '../types'
import type { LoginInput } from '../api/authApi'

export interface AuthContextValue {
  user: AuthUser | null
  isAdmin: boolean
  login: (input: LoginInput) => Promise<void>
  logout: () => Promise<void>
  updateUser: (partial: Partial<AuthUser>) => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
