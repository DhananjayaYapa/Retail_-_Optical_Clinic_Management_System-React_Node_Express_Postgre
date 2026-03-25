import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../redux/store'
import { APP_ROUTES } from '../utilities/constants'
import { AppLayout } from '../templates'

function PrivateRoute() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.LOGIN} replace />
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}

export default PrivateRoute
