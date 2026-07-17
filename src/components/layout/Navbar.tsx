import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth'

export function Navbar() {
  const { user, isAdmin, logout } = useAuth()

  const navItems = [
    { to: '/', label: 'Escalas' },
    { to: '/repertorio', label: 'Repertório' },
    ...(isAdmin ? [{ to: '/musicos', label: 'Músicos' }] : [{ to: '/perfil', label: 'Perfil' }]),
  ]

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="text-lg font-semibold text-brand-700">
          🎵 Ministério de Louvor
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-100 text-brand-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-gray-600 sm:inline">{user?.name}</span>
          <button
            type="button"
            onClick={() => void logout()}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  )
}
