import { useState, type ReactNode } from 'react'
import type { AuthUser } from '../types'
import {
  login as loginRequest,
  logout as logoutRequest,
  type LoginInput,
} from '../api/authApi'
import { AuthContext } from './auth-context'

const STORAGE_KEY = 'bandapp:user'

function getStoredUser(): AuthUser | null {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser)

  async function login(input: LoginInput) {
    const authUser = await loginRequest(input)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser))
    setUser(authUser)
  }

  async function logout() {
    await logoutRequest()
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  function updateUser(partial: Partial<AuthUser>) {
    setUser((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...partial }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  return (
    <AuthContext.Provider
      value={{ user, isAdmin: user?.role === 'admin', login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}
