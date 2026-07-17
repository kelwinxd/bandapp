import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '../components/layout/ProtectedRoute'
import { AdminRoute } from '../components/layout/AdminRoute'
import { LoginPage } from '../pages/LoginPage'
import { EscalasPage } from '../pages/EscalasPage'
import { RepertorioPage } from '../pages/RepertorioPage'
import { MusiciansPage } from '../pages/MusiciansPage'
import { MusicianProfilePage } from '../pages/MusicianProfilePage'
import { MyProfilePage } from '../pages/MyProfilePage'
import { NewServicePage } from '../pages/NewServicePage'
import { ServicePage } from '../pages/ServicePage'
import { NotFoundPage } from '../pages/NotFoundPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<EscalasPage />} />
        <Route path="/repertorio" element={<RepertorioPage />} />
        <Route path="/musicos/:id" element={<MusicianProfilePage />} />
        <Route path="/perfil" element={<MyProfilePage />} />
        <Route path="/escalas/:id" element={<ServicePage />} />

        <Route element={<AdminRoute />}>
          <Route path="/musicos" element={<MusiciansPage />} />
          <Route path="/escalas/nova" element={<NewServicePage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
