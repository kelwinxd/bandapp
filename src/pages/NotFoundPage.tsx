import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-gray-50 text-center">
      <h1 className="text-3xl font-semibold text-gray-900">404</h1>
      <p className="text-sm text-gray-500">Página não encontrada.</p>
      <Link to="/" className="text-sm text-brand-600 hover:text-brand-700">
        Voltar para o início
      </Link>
    </div>
  )
}
