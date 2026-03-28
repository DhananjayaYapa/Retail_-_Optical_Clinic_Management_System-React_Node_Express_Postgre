import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../redux/store'
import { APP_ROUTES } from '../utilities/constants'
import PrivateRoute from './PrivateRoute'

import { AuthPage, Dashboard, Patients, Profile, FutureModulePage } from '../pages'

function AppRoutes() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  return (
    <Routes>
      <Route
        path={APP_ROUTES.LOGIN}
        element={isAuthenticated ? <Navigate to={APP_ROUTES.DASHBOARD} replace /> : <AuthPage />}
      />

      <Route element={<PrivateRoute />}>
        <Route path={APP_ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={APP_ROUTES.PATIENTS} element={<Patients />} />
        <Route path={APP_ROUTES.APPOINTMENTS} element={<FutureModulePage title="Appointments" />} />
        <Route path={APP_ROUTES.EMR} element={<FutureModulePage title="EMR" />} />
        <Route path={APP_ROUTES.BILLING} element={<FutureModulePage title="Billing" />} />
        <Route path={APP_ROUTES.REPORTS} element={<FutureModulePage title="Reports" />} />
        <Route path={APP_ROUTES.PROFILE} element={<Profile />} />
      </Route>

      <Route
        path="*"
        element={
          <Navigate to={isAuthenticated ? APP_ROUTES.DASHBOARD : APP_ROUTES.LOGIN} replace />
        }
      />
    </Routes>
  )
}

export default AppRoutes
